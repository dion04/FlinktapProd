<?php

namespace App\Http\Controllers;

use App\Models\Profile;
use App\Models\ProfileVisit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();

        // Clean up any orphaned profiles for this user
        $this->cleanupOrphanedProfilesForUser($user);

        // Clean up any orphaned resolve codes for this user
        $this->cleanupOrphanedResolveCodesForUser($user);

        // Get user's profiles with related data (only profiles with valid resolve codes)
        $profiles = $user->profiles()
            ->whereHas('resolveCode') // Only get profiles with valid resolve codes
            ->with(['resolveCode', 'visits'])
            ->withCount([
                'visits as total_visits',
                'visits as unique_visitors' => function ($query) {
                    $query->select(DB::raw('COUNT(DISTINCT ip_address)'));
                }
            ])
            ->get()
            ->map(function ($profile) {
                // Get visits data for the last 30 days
                $visitsLast30Days = $profile->visits()
                    ->where('visited_at', '>=', Carbon::now()->subDays(30))
                    ->selectRaw('DATE(visited_at) as date, COUNT(*) as visits')
                    ->groupBy('date')
                    ->orderBy('date')
                    ->get()
                    ->keyBy('date');

                // Fill in missing dates with 0 visits
                $visitsTrend = collect(range(29, 0))->map(function ($daysAgo) use ($visitsLast30Days) {
                    $date = Carbon::now()->subDays($daysAgo)->format('Y-m-d');
                    return [
                        'date' => Carbon::parse($date)->format('M j'),
                        'visits' => $visitsLast30Days->get($date)?->visits ?? 0,
                    ];
                });

                // Get device breakdown (SQLite compatible)
                $deviceBreakdown = $profile->visits()
                    ->whereNotNull('device_info')
                    ->get()
                    ->groupBy(function ($visit) {
                    $deviceInfo = is_string($visit->device_info) ? json_decode($visit->device_info, true) : $visit->device_info;
                    return $deviceInfo['device_type'] ?? 'Unknown';
                })
                    ->map(function ($group) {
                    return $group->count();
                });

                // Get top referrers
                $topReferrers = $profile->visits()
                    ->selectRaw('referer, COUNT(*) as count')
                    ->whereNotNull('referer')
                    ->where('referer', '!=', '')
                    ->groupBy('referer')
                    ->orderByDesc('count')
                    ->limit(5)
                    ->get();

                // Get recent visits
                $recentVisits = $profile->visits()
                    ->orderBy('visited_at', 'desc')
                    ->limit(10)
                    ->get();

                return [
                    'id' => $profile->id,
                    'slug' => $profile->slug,
                    'first_name' => $profile->first_name,
                    'last_name' => $profile->last_name,
                    'display_name' => $profile->display_name,
                    'avatar_url' => $profile->avatar_url,
                    'is_public' => $profile->is_public,
                    'resolve_code' => $profile->resolveCode->code,
                    'total_visits' => $profile->total_visits,
                    'unique_visitors' => $profile->unique_visitors,
                    'visits_today' => $profile->visits()->whereDate('visited_at', today())->count(),
                    'visits_this_week' => $profile->visits()->where('visited_at', '>=', Carbon::now()->startOfWeek())->count(),
                    'visits_this_month' => $profile->visits()->where('visited_at', '>=', Carbon::now()->startOfMonth())->count(),
                    'visits_trend' => $visitsTrend,
                    'device_breakdown' => $deviceBreakdown,
                    'top_referrers' => $topReferrers,
                    'recent_visits' => $recentVisits,
                    'created_at' => $profile->created_at,
                ];
            });

        // Calculate overall analytics
        $totalProfiles = $profiles->count();
        $totalVisits = $profiles->sum('total_visits');
        $totalUniqueVisitors = $profiles->sum('unique_visitors');
        $visitsToday = $profiles->sum('visits_today');
        $visitsThisWeek = $profiles->sum('visits_this_week');
        $visitsThisMonth = $profiles->sum('visits_this_month');

        // Get overall visits trend for the last 30 days
        $overallVisitsTrend = ProfileVisit::whereHas('profile', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })
            ->where('visited_at', '>=', Carbon::now()->subDays(30))
            ->selectRaw('DATE(visited_at) as date, COUNT(*) as visits')
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->keyBy('date');

        $overallTrend = collect(range(29, 0))->map(function ($daysAgo) use ($overallVisitsTrend) {
            $date = Carbon::now()->subDays($daysAgo)->format('Y-m-d');
            return [
                'date' => Carbon::parse($date)->format('M j'),
                'visits' => $overallVisitsTrend->get($date)?->visits ?? 0,
            ];
        });

        return Inertia::render('dashboard', [
            'profiles' => $profiles,
            'analytics' => [
                'total_profiles' => $totalProfiles,
                'total_visits' => $totalVisits,
                'total_unique_visitors' => $totalUniqueVisitors,
                'visits_today' => $visitsToday,
                'visits_this_week' => $visitsThisWeek,
                'visits_this_month' => $visitsThisMonth,
                'overall_visits_trend' => $overallTrend,
            ],
        ]);
    }

    /**
     * Clean up profiles that no longer have valid resolve codes for a specific user
     */
    private function cleanupOrphanedProfilesForUser($user)
    {
        $orphanedProfiles = $user->profiles()->whereDoesntHave('resolveCode')->get();

        foreach ($orphanedProfiles as $profile) {
            // Delete associated visits first
            $profile->visits()->delete();
            // Then delete the profile
            $profile->delete();
        }
    }

    /**
     * Clean up resolve codes that are assigned to a user but have no profile
     */
    private function cleanupOrphanedResolveCodesForUser($user)
    {
        $orphanedCodes = \App\Models\ResolveCode::where('status', 'assigned')
            ->where('user_id', $user->id)
            ->whereDoesntHave('profile')
            ->get();

        foreach ($orphanedCodes as $code) {
            $code->checkAndFixOrphanedState();
        }
    }
}

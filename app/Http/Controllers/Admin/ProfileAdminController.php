<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Profile;
use App\Models\ProfileVisit;
use App\Models\ResolveCode;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class ProfileAdminController extends Controller
{
    public function index(Request $request)
    {
        // First, clean up any orphaned profiles (profiles without valid resolve codes)
        $this->cleanupOrphanedProfiles();

        // Also clean up orphaned resolve codes (assigned but no profile)
        $this->cleanupOrphanedResolveCodes();

        $query = Profile::with(['user', 'resolveCode', 'visits'])
            ->whereHas('resolveCode'); // Only get profiles with valid resolve codes

        // Handle search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('display_name', 'like', "%{$search}%")
                    ->orWhere('bio', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($userQuery) use ($search) {
                        $userQuery->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    })
                    ->orWhereHas('resolveCode', function ($codeQuery) use ($search) {
                        $codeQuery->where('code', 'like', "%{$search}%");
                    });
            });
        }        // Handle status filter
        if ($request->filled('status')) {
            if ($request->status === 'public') {
                $query->where('is_public', true);
            } elseif ($request->status === 'private') {
                $query->where('is_public', false);
            }
        }

        // Handle date filtering
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // Handle sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');

        switch ($sortBy) {
            case 'visits':
                $query->withCount('visits')->orderBy('visits_count', $sortOrder);
                break;
            case 'display_name':
                $query->orderBy('display_name', $sortOrder);
                break;
            case 'user':
                $query->join('users', 'profiles.user_id', '=', 'users.id')
                    ->orderBy('users.name', $sortOrder)
                    ->select('profiles.*');
                break;
            default:
                $query->orderBy($sortBy, $sortOrder);
        }

        $profiles = $query->paginate(20)->appends($request->query());

        // Load visit counts for each profile
        $profiles->getCollection()->transform(function ($profile) {
            $profile->visit_count = $profile->visits()->count();
            $profile->unique_visitors = $profile->visits()->distinct('ip_address')->count('ip_address');
            $profile->recent_visits = $profile->visits()->where('visited_at', '>=', now()->subDays(7))->count();
            return $profile;
        });        // Analytics data
        $analytics = $this->getAnalytics();

        // For export requests, return JSON data if requested via AJAX
        if ($request->filled('export') && $request->export === 'true' && $request->ajax()) {
            // For export, we might want to get all results without pagination
            $exportProfiles = clone $query;
            $allProfiles = $exportProfiles->get();

            // Load visit counts for each profile
            $allProfiles->transform(function ($profile) {
                $profile->visit_count = $profile->visits()->count();
                $profile->unique_visitors = $profile->visits()->distinct('ip_address')->count('ip_address');
                $profile->recent_visits = $profile->visits()->where('visited_at', '>=', now()->subDays(7))->count();
                return $profile;
            });

            return response()->json([
                'profiles' => [
                    'data' => $allProfiles
                ]
            ]);
        }

        return Inertia::render('admin/profiles', [
            'profiles' => $profiles,
            'analytics' => $analytics,
            'filters' => [
                'search' => $request->search ?? '',
                'status' => $request->status ?? '',
                'sort_by' => $sortBy,
                'sort_order' => $sortOrder,
                'date_from' => $request->date_from ?? '',
                'date_to' => $request->date_to ?? '',
            ],
        ]);
    }

    /**
     * Clean up profiles that no longer have valid resolve codes
     */
    private function cleanupOrphanedProfiles()
    {
        $orphanedProfiles = Profile::whereDoesntHave('resolveCode')->get();

        foreach ($orphanedProfiles as $profile) {
            // Delete associated visits first
            $profile->visits()->delete();
            // Then delete the profile
            $profile->delete();
        }
    }

    /**
     * Clean up resolve codes that are marked as assigned but have no profile
     */
    private function cleanupOrphanedResolveCodes()
    {
        $orphanedCodes = \App\Models\ResolveCode::where('status', 'assigned')
            ->whereDoesntHave('profile')
            ->get();

        foreach ($orphanedCodes as $code) {
            $code->checkAndFixOrphanedState();
        }
    }

    private function getAnalytics()
    {
        // Date ranges
        $startOfWeek = Carbon::now()->startOfWeek();
        $endOfWeek = Carbon::now()->endOfWeek();
        $startOfMonth = Carbon::now()->startOfMonth();
        $endOfMonth = Carbon::now()->endOfMonth();
        $startOfYear = Carbon::now()->startOfYear();        // Profile Statistics (only count profiles with valid resolve codes)
        $totalProfiles = Profile::whereHas('resolveCode')->count();
        $publicProfiles = Profile::whereHas('resolveCode')->where('is_public', true)->count();
        $privateProfiles = Profile::whereHas('resolveCode')->where('is_public', false)->count();
        $profilesThisWeek = Profile::whereHas('resolveCode')->whereBetween('created_at', [$startOfWeek, $endOfWeek])->count();
        $profilesThisMonth = Profile::whereHas('resolveCode')->whereBetween('created_at', [$startOfMonth, $endOfMonth])->count();
        $profilesThisYear = Profile::whereHas('resolveCode')->whereBetween('created_at', [$startOfYear, now()])->count();

        // Visit Statistics
        $totalVisits = ProfileVisit::count();
        $visitsThisWeek = ProfileVisit::whereBetween('visited_at', [$startOfWeek, $endOfWeek])->count();
        $visitsThisMonth = ProfileVisit::whereBetween('visited_at', [$startOfMonth, $endOfMonth])->count();
        $uniqueVisitorsThisMonth = ProfileVisit::whereBetween('visited_at', [$startOfMonth, $endOfMonth])
            ->distinct('ip_address')->count('ip_address');        // Top performing profiles (only profiles with valid resolve codes)
        $topProfiles = Profile::select('profiles.*')
            ->whereHas('resolveCode')
            ->withCount('visits')
            ->orderByDesc('visits_count')
            ->limit(10)
            ->get()
            ->map(function ($profile) {
                $profile->unique_visitors = $profile->visits()->distinct('ip_address')->count('ip_address');
                return $profile;
            });

        // Profile creation trend (last 30 days)
        $profileTrend = collect(range(29, 0))->map(function ($daysAgo) {
            $date = Carbon::now()->subDays($daysAgo);
            return [
                'date' => $date->format('M j'),
                'profiles' => Profile::whereHas('resolveCode')->whereDate('created_at', $date)->count(),
                'visits' => ProfileVisit::whereDate('visited_at', $date)->count(),
            ];
        });

        // Visit trend (last 7 days)
        $visitTrend = collect(range(6, 0))->map(function ($daysAgo) {
            $date = Carbon::now()->subDays($daysAgo);
            return [
                'date' => $date->format('M j'),
                'visits' => ProfileVisit::whereDate('visited_at', $date)->count(),
                'unique_visitors' => ProfileVisit::whereDate('visited_at', $date)
                    ->distinct('ip_address')->count('ip_address'),
            ];
        });

        // Geographic distribution
        $countries = ProfileVisit::select('country', DB::raw('count(*) as visits'))
            ->whereNotNull('country')
            ->groupBy('country')
            ->orderByDesc('visits')
            ->limit(10)
            ->get();        // Device/Browser analytics
        $deviceInfo = collect();
        try {
            // Check if we're using SQLite or MySQL
            $driverName = DB::connection()->getDriverName();

            if ($driverName === 'sqlite') {
                // For SQLite, we need to handle JSON differently
                $rawDeviceData = ProfileVisit::whereNotNull('device_info')->get();
                $deviceCounts = [];

                foreach ($rawDeviceData as $visit) {
                    // Check if device_info is already an array or needs to be decoded
                    $deviceInfoData = is_array($visit->device_info)
                        ? $visit->device_info
                        : json_decode($visit->device_info, true);

                    $deviceType = $deviceInfoData['device_type'] ?? 'unknown';
                    $deviceCounts[$deviceType] = ($deviceCounts[$deviceType] ?? 0) + 1;
                }

                $deviceInfo = collect($deviceCounts)
                    ->map(function ($visits, $deviceType) {
                        return (object) ['device_type' => $deviceType, 'visits' => $visits];
                    })
                    ->sortByDesc('visits')
                    ->values();
            } else {
                // For MySQL, use JSON functions
                $deviceInfo = ProfileVisit::select(
                    DB::raw("JSON_UNQUOTE(JSON_EXTRACT(device_info, '$.device_type')) as device_type"),
                    DB::raw('count(*) as visits')
                )
                    ->whereNotNull('device_info')
                    ->groupBy('device_type')
                    ->orderByDesc('visits')
                    ->get();
            }
        } catch (\Exception $e) {
            // Fallback to empty collection if JSON operations fail
            $deviceInfo = collect();
        }        // Social platform usage (only for profiles with valid resolve codes)
        $socialStats = [
            'twitter' => Profile::whereHas('resolveCode')->whereNotNull('twitter_username')->count(),
            'instagram' => Profile::whereHas('resolveCode')->whereNotNull('instagram_username')->count(),
            'linkedin' => Profile::whereHas('resolveCode')->whereNotNull('linkedin_username')->count(),
            'github' => Profile::whereHas('resolveCode')->whereNotNull('github_username')->count(),
            'youtube' => Profile::whereHas('resolveCode')->whereNotNull('youtube_url')->count(),
            'tiktok' => Profile::whereHas('resolveCode')->whereNotNull('tiktok_username')->count(),
            'discord' => Profile::whereHas('resolveCode')->whereNotNull('discord_username')->count(),
            'twitch' => Profile::whereHas('resolveCode')->whereNotNull('twitch_username')->count(),
        ];// Recent activity
        $recentProfiles = Profile::with(['user', 'resolveCode'])
            ->whereHas('resolveCode') // Only get profiles with valid resolve codes
            ->latest()
            ->limit(5)
            ->get();
        $recentVisits = ProfileVisit::with([
            'profile' => function ($query) {
                $query->whereHas('resolveCode'); // Only get visits from profiles with valid resolve codes
            }
        ])
            ->whereHas('profile.resolveCode') // Ensure the profile has a valid resolve code
            ->latest('visited_at')
            ->limit(10)
            ->get();        // User engagement (only for profiles with valid resolve codes)
        $avgVisitsPerProfile = $totalProfiles > 0 ? round($totalVisits / $totalProfiles, 1) : 0;
        $profilesWithVisits = Profile::whereHas('resolveCode')->has('visits')->count();
        $engagementRate = $totalProfiles > 0 ? round(($profilesWithVisits / $totalProfiles) * 100, 1) : 0;

        return [
            'profiles' => [
                'total' => $totalProfiles,
                'public' => $publicProfiles,
                'private' => $privateProfiles,
                'this_week' => $profilesThisWeek,
                'this_month' => $profilesThisMonth,
                'this_year' => $profilesThisYear,
                'privacy_rate' => $totalProfiles > 0 ? round(($publicProfiles / $totalProfiles) * 100, 1) : 0,
            ],
            'visits' => [
                'total' => $totalVisits,
                'this_week' => $visitsThisWeek,
                'this_month' => $visitsThisMonth,
                'unique_this_month' => $uniqueVisitorsThisMonth,
                'avg_per_profile' => $avgVisitsPerProfile,
            ],
            'engagement' => [
                'profiles_with_visits' => $profilesWithVisits,
                'engagement_rate' => $engagementRate,
            ],
            'trends' => [
                'profile_creation' => $profileTrend,
                'visits' => $visitTrend,
            ],
            'top_profiles' => $topProfiles,
            'geography' => $countries,
            'devices' => $deviceInfo,
            'social_platforms' => $socialStats,
            'recent' => [
                'profiles' => $recentProfiles,
                'visits' => $recentVisits,
            ],
        ];
    }

    public function show(Profile $profile)
    {
        $profile->load([
            'user',
            'resolveCode',
            'visits' => function ($query) {
                $query->latest('visited_at')->limit(20);
            }
        ]);

        // Detailed analytics for this specific profile
        $visitStats = [
            'total_visits' => $profile->visits()->count(),
            'unique_visitors' => $profile->visits()->distinct('ip_address')->count('ip_address'),
            'visits_this_week' => $profile->visits()->where('visited_at', '>=', Carbon::now()->startOfWeek())->count(),
            'visits_this_month' => $profile->visits()->where('visited_at', '>=', Carbon::now()->startOfMonth())->count(),
        ];

        // Visit trend for this profile (last 30 days)
        $visitTrend = collect(range(29, 0))->map(function ($daysAgo) use ($profile) {
            $date = Carbon::now()->subDays($daysAgo);
            return [
                'date' => $date->format('M j'),
                'visits' => $profile->visits()->whereDate('visited_at', $date)->count(),
            ];
        });

        // Top countries for this profile
        $countries = $profile->visits()
            ->select('country', DB::raw('count(*) as visits'))
            ->whereNotNull('country')
            ->groupBy('country')
            ->orderByDesc('visits')
            ->limit(5)
            ->get();

        return Inertia::render('admin/profile-detail', [
            'profile' => $profile,
            'visitStats' => $visitStats,
            'visitTrend' => $visitTrend,
            'countries' => $countries,
        ]);
    }
    public function destroy(Profile $profile)
    {
        try {
            \DB::beginTransaction();

            // Delete visits first
            $profile->visits()->delete();

            // Get the resolve code ID if it exists
            $resolveCodeId = $profile->resolve_code_id;

            // Delete the profile
            $profile->delete();

            // If the profile had a resolve code, we need to update it
            if ($resolveCodeId) {
                $resolveCode = \App\Models\ResolveCode::find($resolveCodeId);
                if ($resolveCode) {
                    $resolveCode->status = 'available';
                    $resolveCode->user_id = null;
                    $resolveCode->assigned_at = null;
                    $resolveCode->save();
                }
            }

            \DB::commit();
            return back()->with('success', 'Profile deleted successfully.');
        } catch (\Exception $e) {
            \DB::rollBack();
            \Log::error('Error deleting profile: ' . $e->getMessage());
            return back()->with('error', 'Failed to delete profile: ' . $e->getMessage());
        }
    }
    public function bulkDelete(Request $request)
    {
        try {
            $request->validate([
                'ids' => 'required|array',
                'ids.*' => 'exists:profiles,id',
            ]);

            \DB::beginTransaction();

            $count = 0;
            foreach ($request->ids as $id) {
                $profile = Profile::with(['resolveCode', 'visits'])->find($id);

                if ($profile) {
                    // Delete visits first
                    $profile->visits()->delete();

                    // Get the resolve code ID if it exists
                    $resolveCodeId = $profile->resolve_code_id;

                    // Delete the profile
                    $result = $profile->delete();

                    if ($result) {
                        $count++;

                        // If the profile had a resolve code, we need to update it
                        if ($resolveCodeId) {
                            $resolveCode = \App\Models\ResolveCode::find($resolveCodeId);
                            if ($resolveCode) {
                                $resolveCode->status = 'available';
                                $resolveCode->user_id = null;
                                $resolveCode->assigned_at = null;
                                $resolveCode->save();
                            }
                        }
                    } else {
                        \Log::error("Failed to delete profile with ID: {$id}");
                    }
                }
            }

            \DB::commit();

            return response()->json([
                'success' => true,
                'message' => $count . ' profile(s) deleted successfully.'
            ]);
        } catch (\Exception $e) {
            \DB::rollBack();
            \Log::error('Error deleting profiles: ' . $e->getMessage());
            \Log::error($e->getTraceAsString());

            return response()->json([
                'success' => false,
                'message' => 'Error deleting profiles: ' . $e->getMessage()
            ], 500);
        }
    }

    public function toggleVisibility(Profile $profile)
    {
        $profile->update(['is_public' => !$profile->is_public]);

        $status = $profile->is_public ? 'public' : 'private';
        return back()->with('success', "Profile visibility changed to {$status}.");
    }
}

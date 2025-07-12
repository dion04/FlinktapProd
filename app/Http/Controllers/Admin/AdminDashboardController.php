<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ResolveCode;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class AdminDashboardController extends Controller
{
    public function index(Request $request)
    {
        // Get current week's start and end dates
        $startOfWeek = Carbon::now()->startOfWeek();
        $endOfWeek = Carbon::now()->endOfWeek();

        // Get current month's start and end dates
        $startOfMonth = Carbon::now()->startOfMonth();
        $endOfMonth = Carbon::now()->endOfMonth();

        // NFC Codes Statistics
        $totalNfcCodes = ResolveCode::count();
        $assignedNfcCodes = ResolveCode::where('status', 'assigned')->count();
        $unassignedNfcCodes = ResolveCode::where('status', 'unassigned')->count();
        $nfcCodesThisWeek = ResolveCode::whereBetween('created_at', [$startOfWeek, $endOfWeek])->count();
        $nfcCodesThisMonth = ResolveCode::whereBetween('created_at', [$startOfMonth, $endOfMonth])->count();

        // User Statistics
        $totalUsers = User::count();
        $usersThisWeek = User::whereBetween('created_at', [$startOfWeek, $endOfWeek])->count();
        $usersThisMonth = User::whereBetween('created_at', [$startOfMonth, $endOfMonth])->count();
        $usersByRole = User::select('role', DB::raw('count(*) as count'))
            ->groupBy('role')
            ->pluck('count', 'role')
            ->toArray();

        // Recent Activity - Last 7 days NFC code creation trend
        $last7Days = collect(range(6, 0))->map(function ($daysAgo) {
            $date = Carbon::now()->subDays($daysAgo);
            return [
                'date' => $date->format('M j'),
                'nfc_codes' => ResolveCode::whereDate('created_at', $date)->count(),
                'users' => User::whereDate('created_at', $date)->count(),
            ];
        });

        // Most active creators (users who created the most NFC codes)
        $topCreators = User::leftJoin('resolve_codes', 'users.id', '=', 'resolve_codes.created_by')
            ->select('users.name', DB::raw('count(resolve_codes.id) as codes_created'))
            ->groupBy('users.id', 'users.name')
            ->orderByDesc('codes_created')
            ->limit(5)
            ->get();

        // Recent NFC codes
        $recentNfcCodes = ResolveCode::with(['user', 'creator'])
            ->latest()
            ->limit(10)
            ->get();

        return Inertia::render('admin/admin-dashboard', [
            'analytics' => [
                'nfc_codes' => [
                    'total' => $totalNfcCodes,
                    'assigned' => $assignedNfcCodes,
                    'unassigned' => $unassignedNfcCodes,
                    'this_week' => $nfcCodesThisWeek,
                    'this_month' => $nfcCodesThisMonth,
                    'assignment_rate' => $totalNfcCodes > 0 ? round(($assignedNfcCodes / $totalNfcCodes) * 100, 1) : 0,
                ],
                'users' => [
                    'total' => $totalUsers,
                    'this_week' => $usersThisWeek,
                    'this_month' => $usersThisMonth,
                    'by_role' => $usersByRole,
                ],
                'activity' => [
                    'last_7_days' => $last7Days,
                    'top_creators' => $topCreators,
                ],
                'recent' => [
                    'nfc_codes' => $recentNfcCodes,
                ],
            ],
        ]);
    }
}

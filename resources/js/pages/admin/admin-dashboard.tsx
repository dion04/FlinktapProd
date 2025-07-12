import { ActivityChart } from '@/components/admin/dashboard/activity-chart';
import { MainStatsCards } from '@/components/admin/dashboard/main-stats-cards';
import { NoDataDisplay } from '@/components/admin/dashboard/no-data-display';
import { QuickActions } from '@/components/admin/dashboard/quick-actions';
import { RecentNfcCodesTable } from '@/components/admin/dashboard/recent-nfc-codes-table';
import { RoleDistributionChart } from '@/components/admin/dashboard/role-distribution-chart';
import { SecondaryStatsRow } from '@/components/admin/dashboard/secondary-stats-row';
import { TopCreatorsTable } from '@/components/admin/dashboard/top-creators-table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { AdminDashboardProps, RoleDataItem } from '@/types/admin/analytics';
import { getRoleColor } from '@/utils/role-colors';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Dashboard',
        href: '/admin/dashboard',
    },
];

export default function AdminDashboardIndex({ analytics, auth }: AdminDashboardProps) {
    // Add safety checks for analytics data
    if (!analytics) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Admin Dashboard" />
                <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
                    <NoDataDisplay />
                </div>
            </AppLayout>
        );
    }

    // Process role data for pie chart
    const roleData: RoleDataItem[] = analytics.users?.by_role
        ? Object.entries(analytics.users.by_role).map(([role, count]) => {
              const colors = getRoleColor(role);
              return {
                  name: role.charAt(0).toUpperCase() + role.slice(1),
                  value: count,
                  color: colors.fill,
                  gradientStart: colors.gradient[0],
                  gradientEnd: colors.gradient[1],
                  shadow: colors.shadow,
              };
          })
        : [];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 md:p-6">
                {/* Welcome Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-4xl font-bold tracking-tight text-transparent">
                            Admin Dashboard
                        </h1>
                        <p className="mt-2 text-lg text-gray-600">Monitor and manage NFC codes, users, and system activity</p>
                    </div>
                </div>

                {/* Main Stats Cards */}
                <MainStatsCards analytics={analytics} />

                {/* Quick Actions */}
                <QuickActions />

                {/* Secondary Stats Row */}
                <SecondaryStatsRow analytics={analytics} />

                {/* Charts Section */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Activity Chart */}
                    <ActivityChart activityData={analytics.activity?.last_7_days || []} />

                    {/* Role Distribution */}
                    <RoleDistributionChart roleData={roleData} />
                </div>

                {/* Tables Section */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Top Creators */}
                    <TopCreatorsTable creators={analytics.activity?.top_creators || []} />

                    {/* Recent NFC Codes */}
                    <RecentNfcCodesTable nfcCodes={analytics.recent?.nfc_codes || []} />
                </div>
            </div>
        </AppLayout>
    );
}

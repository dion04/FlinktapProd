import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnalyticsData } from '@/types/admin/analytics';
import { Calendar, QrCode, TrendingUp, Users } from 'lucide-react';

interface MainStatsCardsProps {
    analytics: AnalyticsData;
}

export function MainStatsCards({ analytics }: MainStatsCardsProps) {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Total NFC Codes */}
            <Card className="group relative overflow-hidden border-0 shadow-lg transition-all duration-300 hover:shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/10"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <CardTitle className="text-sm font-semibold text-gray-700">Total NFC Codes</CardTitle>
                    <div className="rounded-lg bg-blue-100 p-2 transition-colors duration-200 group-hover:bg-blue-200">
                        <QrCode className="h-4 w-4 text-blue-600" />
                    </div>
                </CardHeader>{' '}
                <CardContent>
                    <div className="text-3xl font-bold text-blue-700 transition-transform duration-200">
                        {analytics.nfc_codes?.total?.toLocaleString() || '0'}
                    </div>
                    <p className="text-muted-foreground mt-1 text-sm font-medium">
                        <span className="inline-flex items-center font-semibold text-blue-600">
                            <TrendingUp className="mr-1 h-3 w-3" />+{analytics.nfc_codes?.this_week || 0}
                        </span>
                        <span className="ml-1">this week</span>
                    </p>
                    <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-blue-100">
                        <div className="h-1 w-3/4 animate-pulse rounded-full bg-gradient-to-r from-blue-400 to-blue-600"></div>
                    </div>
                </CardContent>
            </Card>

            {/* Assignment Rate */}
            <Card className="group relative overflow-hidden border-0 shadow-lg transition-all duration-300 hover:shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-600/10"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <CardTitle className="text-sm font-semibold text-gray-700">Assignment Rate</CardTitle>
                    <div className="rounded-lg bg-green-100 p-2 transition-colors duration-200 group-hover:bg-green-200">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                    </div>
                </CardHeader>{' '}
                <CardContent>
                    <div className="text-3xl font-bold text-green-700 transition-transform duration-200">
                        {analytics.nfc_codes?.assignment_rate || 0}%
                    </div>
                    <p className="text-muted-foreground mt-1 text-sm font-medium">
                        {analytics.nfc_codes?.assigned || 0} of {analytics.nfc_codes?.total || 0} resolve codes assigned
                    </p>
                    <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-green-100">
                        <div
                            className="h-1 rounded-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-1000"
                            style={{
                                width: `${analytics.nfc_codes?.assignment_rate || 0}%`,
                            }}
                        ></div>
                    </div>
                </CardContent>
            </Card>

            {/* Total Users */}
            <Card className="group relative overflow-hidden border-0 shadow-lg transition-all duration-300 hover:shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-purple-600/10"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <CardTitle className="text-sm font-semibold text-gray-700">Total Users</CardTitle>
                    <div className="rounded-lg bg-purple-100 p-2 transition-colors duration-200 group-hover:bg-purple-200">
                        <Users className="h-4 w-4 text-purple-600" />
                    </div>
                </CardHeader>{' '}
                <CardContent>
                    <div className="text-3xl font-bold text-purple-700 transition-transform duration-200">
                        {analytics.users?.total?.toLocaleString() || '0'}
                    </div>
                    <p className="text-muted-foreground mt-1 text-sm font-medium">
                        <span className="inline-flex items-center font-semibold text-purple-600">
                            <TrendingUp className="mr-1 h-3 w-3" />+{analytics.users?.this_week || 0}
                        </span>
                        <span className="ml-1">this week</span>
                    </p>
                    <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-purple-100">
                        <div className="h-1 w-2/3 animate-pulse rounded-full bg-gradient-to-r from-purple-400 to-purple-600"></div>
                    </div>
                </CardContent>
            </Card>

            {/* Monthly Growth */}
            <Card className="group relative overflow-hidden border-0 shadow-lg transition-all duration-300 hover:shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-orange-600/10"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <CardTitle className="text-sm font-semibold text-gray-700">Monthly Activity</CardTitle>
                    <div className="rounded-lg bg-orange-100 p-2 transition-colors duration-200 group-hover:bg-orange-200">
                        <Calendar className="h-4 w-4 text-orange-600" />
                    </div>
                </CardHeader>{' '}
                <CardContent>
                    <div className="text-3xl font-bold text-orange-700 transition-transform duration-200">
                        {((analytics.nfc_codes?.this_month || 0) + (analytics.users?.this_month || 0)).toLocaleString()}
                    </div>
                    <p className="text-muted-foreground mt-1 text-sm font-medium">
                        {analytics.nfc_codes?.this_month || 0} codes, {analytics.users?.this_month || 0} users
                    </p>
                    <div className="mt-3 flex items-center justify-between text-xs">
                        <span className="font-medium text-orange-600">This month's activity</span>
                        <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnalyticsData } from '@/types/admin/analytics';
import { getRoleColor } from '@/utils/role-colors';
import { UserCheck, UserX, Users } from 'lucide-react';

interface SecondaryStatsRowProps {
    analytics: AnalyticsData;
}

export function SecondaryStatsRow({ analytics }: SecondaryStatsRowProps) {
    return (
        <div className="grid gap-6 md:grid-cols-3">
            {/* Assigned Codes */}
            <Card className="group relative overflow-hidden border-0 shadow-lg transition-all duration-300 hover:shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-600/10"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Assigned Codes</CardTitle>
                    <div className="rounded-lg bg-green-100 p-2 transition-colors duration-200 group-hover:bg-green-200">
                        <UserCheck className="h-4 w-4 text-green-600" />
                    </div>
                </CardHeader>{' '}
                <CardContent>
                    <div className="text-xl font-bold text-green-600">{analytics.nfc_codes?.assigned?.toLocaleString() || '0'}</div>
                    <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-green-100">
                        <div
                            className="h-1 rounded-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-1000"
                            style={{
                                width: `${Math.min((analytics.nfc_codes?.assigned / Math.max(analytics.nfc_codes?.total, 1)) * 100, 100)}%`,
                            }}
                        ></div>
                    </div>
                </CardContent>
            </Card>

            {/* Unassigned Codes */}
            <Card className="group relative overflow-hidden border-0 shadow-lg transition-all duration-300 hover:shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-amber-600/10"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Unassigned Codes</CardTitle>
                    <div className="rounded-lg bg-amber-100 p-2 transition-colors duration-200 group-hover:bg-amber-200">
                        <UserX className="h-4 w-4 text-amber-600" />
                    </div>
                </CardHeader>{' '}
                <CardContent>
                    <div className="text-xl font-bold text-amber-600">{analytics.nfc_codes?.unassigned?.toLocaleString() || '0'}</div>
                    <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-amber-100">
                        <div
                            className="h-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-1000"
                            style={{
                                width: `${Math.min((analytics.nfc_codes?.unassigned / Math.max(analytics.nfc_codes?.total, 1)) * 100, 100)}%`,
                            }}
                        ></div>
                    </div>
                </CardContent>
            </Card>

            {/* User Roles */}
            <Card className="group relative overflow-hidden border-0 shadow-lg transition-all duration-300 hover:shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-purple-600/10"></div>

                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">User Roles</CardTitle>{' '}
                    <div className="rounded-lg bg-purple-100 p-2 transition-colors duration-200 group-hover:bg-purple-200">
                        <Users className="h-4 w-4 text-purple-600" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        {Object.entries(analytics.users?.by_role || {}).map(([role, count]) => {
                            const colors = getRoleColor(role);
                            return (
                                <Badge
                                    key={role}
                                    className="rounded-full px-3 py-1 text-xs font-medium transition-all duration-200 hover:shadow-sm"
                                    style={{
                                        background: `linear-gradient(to right, ${colors.gradient[0]}, ${colors.gradient[1]})`,
                                        color: 'white',
                                    }}
                                >
                                    {role}: {count}
                                </Badge>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

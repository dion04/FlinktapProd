import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatNumber } from '@/utils/format-utils';
import { Activity, BarChart3, TrendingUp, Users } from 'lucide-react';

type AnalyticsCardsProps = {
    analytics: {
        profiles: {
            total: number;
            public: number;
            private: number;
            this_week: number;
            this_month: number;
            this_year: number;
            privacy_rate: number;
        };
        visits: {
            total: number;
            this_week: number;
            this_month: number;
            unique_this_month: number;
            avg_per_profile: number;
        };
        engagement: {
            profiles_with_visits: number;
            engagement_rate: number;
        };
    };
};

export function AnalyticsCards({ analytics }: AnalyticsCardsProps) {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Profiles</CardTitle>
                    <Users className="text-muted-foreground h-4 w-4" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatNumber(analytics.profiles.total)}</div>
                    <p className="text-muted-foreground text-xs">+ {analytics.profiles.this_month} this month</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
                    <Activity className="text-muted-foreground h-4 w-4" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatNumber(analytics.visits.total)}</div>
                    <p className="text-muted-foreground text-xs">+ {analytics.visits.this_month} this month</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
                    <TrendingUp className="text-muted-foreground h-4 w-4" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{analytics.engagement.engagement_rate}%</div>
                    <p className="text-muted-foreground text-xs">{analytics.engagement.profiles_with_visits} profiles with visits</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg Visits/Profile</CardTitle>
                    <BarChart3 className="text-muted-foreground h-4 w-4" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{analytics.visits.avg_per_profile}</div>
                    <p className="text-muted-foreground text-xs">{analytics.profiles.privacy_rate}% public profiles</p>
                </CardContent>
            </Card>
        </div>
    );
}

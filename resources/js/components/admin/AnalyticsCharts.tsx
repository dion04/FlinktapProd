import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatNumber } from '@/utils/format-utils';
import { Github, Globe, Instagram, Linkedin, MessageCircle, Twitter, Youtube } from 'lucide-react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];

const getSocialIcon = (platform: string) => {
    switch (platform) {
        case 'twitter':
            return <Twitter className="h-4 w-4" />;
        case 'instagram':
            return <Instagram className="h-4 w-4" />;
        case 'linkedin':
            return <Linkedin className="h-4 w-4" />;
        case 'github':
            return <Github className="h-4 w-4" />;
        case 'youtube':
            return <Youtube className="h-4 w-4" />;
        case 'discord':
            return <MessageCircle className="h-4 w-4" />;
        default:
            return <Globe className="h-4 w-4" />;
    }
};

type AnalyticsChartsProps = {
    analytics: {
        trends: {
            profile_creation: Array<{
                date: string;
                profiles: number;
                visits: number;
            }>;
            visits: Array<{
                date: string;
                visits: number;
                unique_visitors: number;
            }>;
        };
        geography: Array<{
            country: string;
            visits: number;
        }>;
        social_platforms: Record<string, number>;
    };
};

export function AnalyticsCharts({ analytics }: AnalyticsChartsProps) {
    return (
        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Profile Creation Trend</CardTitle>
                    <CardDescription>Profiles and visits over the last 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={analytics.trends.profile_creation}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Area type="monotone" dataKey="profiles" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} name="Profiles" />
                            <Area type="monotone" dataKey="visits" stroke="#10b981" fill="#10b981" fillOpacity={0.2} name="Visits" />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Visit Analytics</CardTitle>
                    <CardDescription>Daily visits and unique visitors</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={analytics.trends.visits}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="visits" fill="#3b82f6" name="Total Visits" />
                            <Bar dataKey="unique_visitors" fill="#10b981" name="Unique Visitors" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Geographic Distribution</CardTitle>
                    <CardDescription>Top countries by visits</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {analytics.geography.slice(0, 5).map((country, index) => (
                            <div key={country.country} className="flex items-center gap-2">
                                <div className="flex w-40 items-center gap-2">
                                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                    <span className="truncate font-medium">{country.country || 'Unknown'}</span>
                                </div>
                                <div className="flex-1">
                                    <div className="h-2 rounded-full bg-gray-100">
                                        <div
                                            className="h-2 rounded-full"
                                            style={{
                                                width: `${(country.visits / analytics.geography[0].visits) * 100}%`,
                                                backgroundColor: COLORS[index % COLORS.length],
                                            }}
                                        />
                                    </div>
                                </div>
                                <span className="text-sm font-medium">{formatNumber(country.visits)}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Social Platform Usage</CardTitle>
                    <CardDescription>Profiles using each platform</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {Object.entries(analytics.social_platforms)
                            .sort(([, a], [, b]) => b - a)
                            .slice(0, 6)
                            .map(([platform, count], index) => (
                                <div key={platform} className="flex items-center gap-2">
                                    <div className="flex w-40 items-center gap-2">
                                        <div className="rounded-full p-1" style={{ backgroundColor: COLORS[index % COLORS.length] + '20' }}>
                                            {getSocialIcon(platform)}
                                        </div>
                                        <span className="font-medium capitalize">{platform}</span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="h-2 rounded-full bg-gray-100">
                                            <div
                                                className="h-2 rounded-full"
                                                style={{
                                                    width: `${(count / Object.values(analytics.social_platforms)[0]) * 100}%`,
                                                    backgroundColor: COLORS[index % COLORS.length],
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <span className="text-sm font-medium">{formatNumber(count)}</span>
                                </div>
                            ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

import { Breadcrumbs } from '@/components/breadcrumbs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Activity, ArrowLeft, Calendar, ExternalLink, Eye, Globe, Lock, MapPin, TrendingUp, User, Users } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface Profile {
    id: number;
    display_name: string;
    slug: string;
    bio: string | null;
    avatar_url: string | null;
    website_url: string | null;
    is_public: boolean;
    created_at: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
    resolve_code?: {
        id: number;
        code: string;
    } | null;
    visits: Array<{
        id: number;
        ip_address: string | null;
        country: string | null;
        visited_at: string;
    }>;
}

interface VisitStats {
    total_visits: number;
    unique_visitors: number;
    visits_this_week: number;
    visits_this_month: number;
}

interface ProfileDetailProps {
    profile: Profile;
    visitStats: VisitStats;
    visitTrend: Array<{
        date: string;
        visits: number;
    }>;
    countries: Array<{
        country: string;
        visits: number;
    }>;
}

function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function formatNumber(num: number) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

export default function ProfileDetail({ profile, visitStats, visitTrend, countries }: ProfileDetailProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Admin Dashboard',
            href: '/admin/dashboard',
        },
        {
            title: 'Profiles',
            href: '/admin/profiles',
        },
        {
            title: profile.display_name,
            href: `/admin/profiles/${profile.id}`,
        },
    ];

    return (
        <AppLayout>
            <Head title={`Profile: ${profile.display_name}`} />

            <div className="flex flex-col gap-8 p-8">
                <div>
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                    <div className="mt-4 flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href="/admin/profiles">
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Back to Profiles
                                    </Link>
                                </Button>
                            </div>
                            <h1 className="mt-2 text-3xl font-bold">{profile.display_name}</h1>
                            <p className="text-muted-foreground mt-1">Profile analytics and management</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant={profile.is_public ? 'default' : 'secondary'} className="flex items-center gap-1">
                                {profile.is_public ? <Globe className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                                {profile.is_public ? 'Public' : 'Private'}
                            </Badge>
                            <Button variant="outline" asChild>
                                <Link href={`/profile/${profile.slug}`} target="_blank">
                                    <ExternalLink className="mr-2 h-4 w-4" />
                                    View Profile
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Profile Info Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    {profile.avatar_url ? (
                                        <img src={profile.avatar_url} alt={profile.display_name} className="h-12 w-12 rounded-full object-cover" />
                                    ) : (
                                        <div className="bg-muted flex h-12 w-12 items-center justify-center rounded-full">
                                            <User className="text-muted-foreground h-6 w-6" />
                                        </div>
                                    )}
                                    <div>
                                        <div className="font-semibold">{profile.display_name}</div>
                                        <div className="text-muted-foreground text-sm">/{profile.slug}</div>
                                    </div>
                                </div>

                                {profile.bio && (
                                    <div>
                                        <div className="text-muted-foreground mb-1 text-sm font-medium">Bio</div>
                                        <p className="text-sm">{profile.bio}</p>
                                    </div>
                                )}

                                <div>
                                    <div className="text-muted-foreground mb-1 text-sm font-medium">Resolve Code</div>{' '}
                                    <code className="bg-muted rounded px-2 py-1 text-sm">{profile.resolve_code?.code || 'N/A'}</code>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <div className="text-muted-foreground mb-1 text-sm font-medium">Owner</div>
                                    <div>
                                        <div className="font-medium">{profile.user.name}</div>
                                        <div className="text-muted-foreground text-sm">{profile.user.email}</div>
                                    </div>
                                </div>

                                <div>
                                    <div className="text-muted-foreground mb-1 text-sm font-medium">Created</div>
                                    <div className="flex items-center gap-1 text-sm">
                                        <Calendar className="h-4 w-4" />
                                        {formatDate(profile.created_at)}
                                    </div>
                                </div>

                                {profile.website_url && (
                                    <div>
                                        <div className="text-muted-foreground mb-1 text-sm font-medium">Website</div>
                                        <a
                                            href={profile.website_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
                                        >
                                            <ExternalLink className="h-3 w-3" />
                                            {profile.website_url}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Visit Analytics */}
                <div className="grid gap-6 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
                            <Eye className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatNumber(visitStats.total_visits)}</div>
                            <p className="text-muted-foreground text-xs">All time visits</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
                            <Users className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatNumber(visitStats.unique_visitors)}</div>
                            <p className="text-muted-foreground text-xs">Unique IP addresses</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">This Week</CardTitle>
                            <TrendingUp className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatNumber(visitStats.visits_this_week)}</div>
                            <p className="text-muted-foreground text-xs">Last 7 days</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">This Month</CardTitle>
                            <Activity className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatNumber(visitStats.visits_this_month)}</div>
                            <p className="text-muted-foreground text-xs">Last 30 days</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Visit Trend Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Visit Trend</CardTitle>
                            <CardDescription>Daily visits over the last 30 days</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={visitTrend}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="visits" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Geographic Distribution */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Top Countries</CardTitle>
                            <CardDescription>Visits by country</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {countries.length > 0 ? (
                                    countries.map((country, index) => (
                                        <div key={country.country} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <MapPin className="text-muted-foreground h-4 w-4" />
                                                <span className="text-sm font-medium">{country.country}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="bg-muted h-2 w-20 rounded-full">
                                                    <div
                                                        className="bg-primary h-2 rounded-full"
                                                        style={{ width: `${(country.visits / countries[0].visits) * 100}%` }}
                                                    />
                                                </div>
                                                <span className="text-muted-foreground min-w-[3rem] text-right text-sm">{country.visits}</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-muted-foreground py-4 text-center text-sm">No geographic data available</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Visits */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Visits</CardTitle>
                        <CardDescription>Latest profile visits</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {profile.visits.length > 0 ? (
                                profile.visits.map((visit) => (
                                    <div key={visit.id} className="flex items-center justify-between rounded-lg border p-3">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-full">
                                                <User className="text-muted-foreground h-4 w-4" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium">{visit.ip_address || 'Unknown IP'}</div>
                                                <div className="text-muted-foreground text-xs">{visit.country || 'Unknown location'}</div>
                                            </div>
                                        </div>
                                        <div className="text-muted-foreground text-sm">{formatDate(visit.visited_at)}</div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-muted-foreground py-4 text-center text-sm">No visits recorded yet</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

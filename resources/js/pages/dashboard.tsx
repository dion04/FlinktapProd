import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Calendar, Clock, Edit, ExternalLink, Eye, MapPin, Monitor, QrCode, Smartphone, TrendingUp, Users } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface Profile {
    id: number;
    slug: string;
    first_name: string;
    last_name: string;
    avatar_url: string | null;
    is_public: boolean;
    resolve_code: string;
    total_visits: number;
    unique_visitors: number;
    visits_today: number;
    visits_this_week: number;
    visits_this_month: number;
    visits_trend: Array<{ date: string; visits: number }>;
    device_breakdown: Record<string, number>;
    top_referrers: Array<{ referer: string; count: number }>;
    recent_visits: Array<{
        id: number;
        ip_address: string;
        country: string | null;
        city: string | null;
        visited_at: string;
        device_info: {
            device?: string;
            browser?: string;
            os?: string;
        } | null;
    }>;
    created_at: string;
}

interface Analytics {
    total_profiles: number;
    total_visits: number;
    total_unique_visitors: number;
    visits_today: number;
    visits_this_week: number;
    visits_this_month: number;
    overall_visits_trend: Array<{ date: string; visits: number }>;
}

interface DashboardProps {
    profiles: Profile[];
    analytics: Analytics;
}

export default function Dashboard({ profiles, analytics }: DashboardProps) {
    const deviceColors = {
        desktop: '#3B82F6',
        mobile: '#10B981',
        tablet: '#F59E0B',
        Unknown: '#6B7280',
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getDeviceIcon = (device: string) => {
        switch (device?.toLowerCase()) {
            case 'mobile':
                return <Smartphone className="h-3 w-3" />;
            case 'tablet':
                return <Monitor className="h-3 w-3" />;
            default:
                return <Monitor className="h-3 w-3" />;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 md:p-6">
                {/* Welcome Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-4xl font-bold tracking-tight text-transparent">
                            Dashboard
                        </h1>
                        <p className="mt-2 text-lg text-gray-600">Monitor your NFC profiles and analytics in real-time</p>
                    </div>
                </div>

                {/* Analytics Overview Cards */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="group relative overflow-hidden border-0 shadow-lg transition-all duration-300 hover:shadow-xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/10"></div>
                        <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                            <CardTitle className="text-sm font-semibold text-gray-700">Total Profiles</CardTitle>
                            <div className="rounded-lg bg-blue-100 p-2 transition-colors duration-200 group-hover:bg-blue-200">
                                <QrCode className="h-4 w-4 text-blue-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-blue-700 transition-transform duration-200">{analytics.total_profiles}</div>
                            <p className="text-muted-foreground mt-1 text-sm font-medium">Active NFC profiles</p>
                            <div className="mt-3 flex items-center text-xs">
                                <div className="mr-2 h-2 w-2 animate-pulse rounded-full bg-blue-500"></div>
                                <span className="font-medium text-blue-600">Live tracking</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="group relative overflow-hidden border-0 shadow-lg transition-all duration-300 hover:shadow-xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-600/10"></div>
                        <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-green-500 to-green-600"></div>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                            <CardTitle className="text-sm font-semibold text-gray-700">Total Visits</CardTitle>
                            <div className="rounded-lg bg-green-100 p-2 transition-colors duration-200 group-hover:bg-green-200">
                                <Eye className="h-4 w-4 text-green-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-green-700 transition-transform duration-200">
                                {analytics.total_visits.toLocaleString()}
                            </div>
                            <p className="text-muted-foreground mt-1 text-sm font-medium">
                                <span className="inline-flex items-center font-semibold text-green-600">
                                    <TrendingUp className="mr-1 h-3 w-3" />+{analytics.visits_today}
                                </span>
                                <span className="ml-1">today</span>
                            </p>
                            <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-green-100">
                                <div className="h-1 w-3/4 animate-pulse rounded-full bg-gradient-to-r from-green-400 to-green-600"></div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="group relative overflow-hidden border-0 shadow-lg transition-all duration-300 hover:shadow-xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-purple-600/10"></div>
                        <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-purple-500 to-purple-600"></div>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                            <CardTitle className="text-sm font-semibold text-gray-700">Unique Visitors</CardTitle>
                            <div className="rounded-lg bg-purple-100 p-2 transition-colors duration-200 group-hover:bg-purple-200">
                                <Users className="h-4 w-4 text-purple-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-purple-700 transition-transform duration-200">
                                {analytics.total_unique_visitors.toLocaleString()}
                            </div>
                            <p className="text-muted-foreground mt-1 text-sm font-medium">
                                <span className="inline-flex items-center font-semibold text-purple-600">
                                    <Calendar className="mr-1 h-3 w-3" />+{analytics.visits_this_week}
                                </span>
                                <span className="ml-1">this week</span>
                            </p>
                            <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-purple-100">
                                <div
                                    className="h-1 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 transition-all duration-1000"
                                    style={{
                                        width: `${Math.min((analytics.total_unique_visitors / Math.max(analytics.total_visits, 1)) * 100, 100)}%`,
                                    }}
                                ></div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="group relative overflow-hidden border-0 shadow-lg transition-all duration-300 hover:shadow-xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-orange-600/10"></div>
                        <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-orange-500 to-orange-600"></div>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                            <CardTitle className="text-sm font-semibold text-gray-700">Monthly Visits</CardTitle>
                            <div className="rounded-lg bg-orange-100 p-2 transition-colors duration-200 group-hover:bg-orange-200">
                                <Calendar className="h-4 w-4 text-orange-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-orange-700 transition-transform duration-200">
                                {analytics.visits_this_month.toLocaleString()}
                            </div>
                            <p className="text-muted-foreground mt-1 text-sm font-medium">This month's activity</p>
                            <div className="mt-3 flex items-center justify-between text-xs">
                                <span className="font-medium text-orange-600">
                                    {Math.round((analytics.visits_this_month / Math.max(analytics.total_visits, 1)) * 100)}% of total
                                </span>
                                <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Overall Visits Trend */}
                <Card className="relative hidden overflow-hidden md:block">
                    <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500"></div>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-blue-600" />
                            Visits Trend (Last 30 Days)
                        </CardTitle>
                        <CardDescription className="text-sm">Daily visits across all your profiles</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-2">
                        <ResponsiveContainer width="100%" height={320}>
                            <AreaChart data={analytics.overall_visits_trend} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                                <defs>
                                    <linearGradient id="visitGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.9} />
                                        <stop offset="50%" stopColor="#6366F1" stopOpacity={0.4} />
                                        <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.1} />
                                    </linearGradient>
                                    <linearGradient id="strokeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#3B82F6" />
                                        <stop offset="50%" stopColor="#6366F1" />
                                        <stop offset="100%" stopColor="#8B5CF6" />
                                    </linearGradient>
                                    <filter id="dropShadow">
                                        <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#3B82F6" floodOpacity="0.2" />
                                    </filter>
                                </defs>
                                <CartesianGrid strokeDasharray="2 4" stroke="#e5e7eb" strokeOpacity={0.3} horizontal={true} vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 11, fill: '#6b7280', fontWeight: '500' }}
                                    tickLine={false}
                                    axisLine={false}
                                    interval="preserveStartEnd"
                                    tickMargin={10}
                                />
                                <YAxis
                                    tick={{ fontSize: 11, fill: '#6b7280', fontWeight: '500' }}
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={10}
                                    domain={['dataMin - 5', 'dataMax + 5']}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                        border: 'none',
                                        borderRadius: '16px',
                                        fontSize: '13px',
                                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                                        padding: '16px',
                                        backdropFilter: 'blur(8px)',
                                        minWidth: '120px',
                                    }}
                                    labelStyle={{
                                        color: '#1f2937',
                                        fontWeight: '600',
                                        fontSize: '13px',
                                        marginBottom: '4px',
                                    }}
                                    cursor={{
                                        stroke: 'url(#strokeGradient)',
                                        strokeWidth: 2,
                                        strokeDasharray: '4 4',
                                        filter: 'url(#dropShadow)',
                                    }}
                                    formatter={(value, name) => [
                                        <span style={{ color: '#3B82F6', fontWeight: '700' }}>{value.toLocaleString()}</span>,
                                        'Visits',
                                    ]}
                                    labelFormatter={(label) => `${label}`}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="visits"
                                    stroke="url(#strokeGradient)"
                                    strokeWidth={3}
                                    fill="url(#visitGradient)"
                                    dot={false}
                                    activeDot={{
                                        r: 6,
                                        stroke: '#ffffff',
                                        strokeWidth: 3,
                                        fill: '#3B82F6',
                                        filter: 'url(#dropShadow)',
                                        style: { cursor: 'pointer' },
                                    }}
                                    animationDuration={1500}
                                    animationEasing="ease-out"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Profiles Grid */}
                <div className="space-y-8">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h2 className="flex items-center gap-3 text-2xl font-bold text-gray-900 md:text-3xl">
                                <div className="rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 p-2">
                                    <QrCode className="h-5 w-5 text-blue-600 md:h-6 md:w-6" />
                                </div>
                                Your Profiles
                            </h2>
                            <p className="mt-2 text-sm text-gray-600 md:text-base">Manage and monitor your NFC profile analytics</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                <span>Live</span>
                            </div>
                            <span>•</span>
                            <span>
                                {profiles.length} profile{profiles.length !== 1 ? 's' : ''}
                            </span>
                        </div>
                    </div>

                    {profiles.length === 0 ? (
                        <Card className="border-0 shadow-lg">
                            <CardContent className="flex flex-col items-center justify-center py-16">
                                <div className="relative mb-6">
                                    <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-20"></div>
                                    <QrCode className="relative z-10 h-16 w-16 text-gray-400" />
                                </div>
                                <h3 className="mb-3 text-xl font-bold text-gray-800">No profiles yet</h3>
                                <p className="mb-8 max-w-md text-center leading-relaxed text-gray-600">
                                    Create your first NFC profile to start tracking visits and sharing your information seamlessly.
                                </p>
                                <div className="flex items-center gap-4">
                                    <Button
                                        className="bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg hover:from-blue-600 hover:to-purple-700"
                                        onClick={() =>
                                            window.open(
                                                'mailto:test@email.com?subject=Create NFC Profile&body=Hi, I would like to create my first NFC profile. Please let me know how to proceed.',
                                                '_blank',
                                            )
                                        }
                                    >
                                        <QrCode className="mr-2 h-4 w-4" />
                                        Contact Flink for Profiles
                                    </Button>
                                    <Button variant="outline" className="border-gray-200 hover:bg-gray-50">
                                        Learn More
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-8 md:grid-cols-2">
                            {profiles.map((profile) => (
                                <Card
                                    key={profile.id}
                                    className="group overflow-hidden border-0 shadow-lg transition-all duration-300 hover:shadow-xl"
                                >
                                    <CardHeader className="pb-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 md:gap-4">
                                                {profile.avatar_url ? (
                                                    <div className="relative">
                                                        <img
                                                            src={profile.avatar_url}
                                                            alt={`${profile.first_name} ${profile.last_name}`}
                                                            className="h-10 w-10 rounded-full object-cover ring-2 ring-gray-100 transition-all duration-200 group-hover:ring-blue-200 md:h-12 md:w-12"
                                                        />
                                                        <div className="absolute -right-1 -bottom-1 h-3 w-3 rounded-full border-2 border-white bg-green-500 md:h-4 md:w-4"></div>
                                                    </div>
                                                ) : (
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-200 ring-2 ring-gray-100 transition-all duration-200 group-hover:ring-blue-200 md:h-12 md:w-12">
                                                        <Users className="h-5 w-5 text-gray-600 md:h-6 md:w-6" />
                                                    </div>
                                                )}
                                                <div>
                                                    <CardTitle className="text-base font-bold text-gray-800 transition-colors duration-200 group-hover:text-blue-700 md:text-lg">
                                                        {profile.first_name} {profile.last_name}
                                                        <span className="text-sm font-normal text-gray-500"> ({profile.slug})</span>
                                                    </CardTitle>
                                                    <CardDescription className="rounded-md bg-gray-50 px-2 py-1 font-mono text-xs text-gray-500 md:text-sm">
                                                        {profile.resolve_code}
                                                    </CardDescription>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 md:gap-2">
                                                <Badge
                                                    variant={profile.is_public ? 'default' : 'secondary'}
                                                    className={`text-xs ${
                                                        profile.is_public
                                                            ? 'border-green-200 bg-green-100 text-green-800'
                                                            : 'border-gray-200 bg-gray-100 text-gray-800'
                                                    }`}
                                                >
                                                    <span className="hidden sm:inline">{profile.is_public ? '🌐 Public' : '🔒 Private'}</span>
                                                    <span className="sm:hidden">{profile.is_public ? '🌐' : '🔒'}</span>
                                                </Badge>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    asChild
                                                    className="h-7 w-7 p-0 transition-colors duration-200 hover:border-blue-200 hover:bg-blue-50 md:h-8 md:w-8"
                                                >
                                                    <Link href={`profile/${profile.slug}`}>
                                                        <ExternalLink className="h-3 w-3" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    asChild
                                                    className="h-7 w-7 p-0 transition-colors duration-200 hover:border-purple-200 hover:bg-purple-50 md:h-8 md:w-8"
                                                >
                                                    <Link href={`profile/${profile.slug}/edit`}>
                                                        <Edit className="h-3 w-3" />
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="space-y-6">
                                        {' '}
                                        {/* Quick Stats */}
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                            <div className="hover:to-blue-150 group rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-3 text-center shadow-sm transition-all duration-300 hover:from-blue-100 hover:shadow-md md:p-4">
                                                <div className="text-xl font-bold text-blue-700 transition-transform duration-200 group-hover:scale-110 md:text-2xl">
                                                    {profile.total_visits.toLocaleString()}
                                                </div>
                                                <div className="text-muted-foreground mt-1 text-xs font-semibold">Total Visits</div>
                                                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-blue-200">
                                                    <div className="h-1.5 w-full animate-pulse rounded-full bg-gradient-to-r from-blue-400 to-blue-600"></div>
                                                </div>
                                            </div>
                                            <div className="hover:to-green-150 group rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-green-100 p-3 text-center shadow-sm transition-all duration-300 hover:from-green-100 hover:shadow-md md:p-4">
                                                <div className="text-xl font-bold text-green-700 transition-transform duration-200 group-hover:scale-110 md:text-2xl">
                                                    {profile.unique_visitors.toLocaleString()}
                                                </div>
                                                <div className="text-muted-foreground mt-1 text-xs font-semibold">Unique Visitors</div>
                                                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-green-200">
                                                    <div
                                                        className="h-1.5 rounded-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-1000 ease-out"
                                                        style={{
                                                            width: `${Math.min((profile.unique_visitors / Math.max(profile.total_visits, 1)) * 100, 100)}%`,
                                                        }}
                                                    ></div>
                                                </div>
                                                <div className="mt-1 text-xs font-medium text-green-600">
                                                    {Math.round((profile.unique_visitors / Math.max(profile.total_visits, 1)) * 100)}% unique
                                                </div>
                                            </div>
                                            <div className="hover:to-purple-150 group rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 p-3 text-center shadow-sm transition-all duration-300 hover:from-purple-100 hover:shadow-md md:p-4">
                                                <div className="text-xl font-bold text-purple-700 transition-transform duration-200 group-hover:scale-110 md:text-2xl">
                                                    {profile.visits_today}
                                                </div>
                                                <div className="text-muted-foreground mt-1 text-xs font-semibold">Today</div>
                                                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-purple-200">
                                                    <div
                                                        className="h-1.5 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 transition-all duration-1000 ease-out"
                                                        style={{
                                                            width: `${Math.min((profile.visits_today / Math.max(profile.total_visits, 1)) * 100 * 30, 100)}%`,
                                                        }}
                                                    ></div>
                                                </div>
                                                <div className="mt-1 text-xs font-medium text-purple-600">
                                                    {profile.visits_today > 0 ? 'Active today' : 'No visits today'}
                                                </div>
                                            </div>
                                        </div>
                                        {/* Visits Trend Chart */}
                                        <div className="hidden md:block">
                                            <h4 className="mb-4 flex items-center gap-2 text-sm font-semibold">
                                                <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                                                30-Day Visits Trend
                                            </h4>
                                            <ResponsiveContainer width="100%" height={160}>
                                                <AreaChart data={profile.visits_trend} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                                                    <defs>
                                                        <linearGradient id={`profileGradient-${profile.id}`} x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="0%" stopColor="#10B981" stopOpacity={0.8} />
                                                            <stop offset="50%" stopColor="#059669" stopOpacity={0.4} />
                                                            <stop offset="100%" stopColor="#047857" stopOpacity={0.1} />
                                                        </linearGradient>
                                                        <linearGradient id={`profileStroke-${profile.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                                                            <stop offset="0%" stopColor="#10B981" />
                                                            <stop offset="50%" stopColor="#059669" />
                                                            <stop offset="100%" stopColor="#047857" />
                                                        </linearGradient>
                                                        <filter id={`profileShadow-${profile.id}`}>
                                                            <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#10B981" floodOpacity="0.3" />
                                                        </filter>
                                                    </defs>
                                                    <CartesianGrid
                                                        strokeDasharray="1 3"
                                                        stroke="#e5e7eb"
                                                        strokeOpacity={0.2}
                                                        horizontal={true}
                                                        vertical={false}
                                                    />
                                                    <XAxis
                                                        dataKey="date"
                                                        tick={{ fontSize: 9, fill: '#9ca3af', fontWeight: '500' }}
                                                        tickLine={false}
                                                        axisLine={false}
                                                        interval="preserveStartEnd"
                                                        tickMargin={8}
                                                    />
                                                    <YAxis hide />
                                                    <Tooltip
                                                        contentStyle={{
                                                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                            border: 'none',
                                                            borderRadius: '12px',
                                                            fontSize: '11px',
                                                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                                                            padding: '10px 14px',
                                                            backdropFilter: 'blur(4px)',
                                                            minWidth: '100px',
                                                        }}
                                                        labelStyle={{
                                                            color: '#1f2937',
                                                            fontWeight: '600',
                                                            fontSize: '11px',
                                                            marginBottom: '2px',
                                                        }}
                                                        cursor={{
                                                            stroke: '#10B981',
                                                            strokeWidth: 1.5,
                                                            strokeDasharray: '3 3',
                                                            filter: `url(#profileShadow-${profile.id})`,
                                                        }}
                                                        formatter={(value, name) => [
                                                            <span style={{ color: '#10B981', fontWeight: '700', fontSize: '12px' }}>{value}</span>,
                                                            'Visits',
                                                        ]}
                                                    />
                                                    <Area
                                                        type="monotone"
                                                        dataKey="visits"
                                                        stroke={`url(#profileStroke-${profile.id})`}
                                                        strokeWidth={2.5}
                                                        fill={`url(#profileGradient-${profile.id})`}
                                                        dot={false}
                                                        activeDot={{
                                                            r: 4,
                                                            stroke: '#ffffff',
                                                            strokeWidth: 2,
                                                            fill: '#10B981',
                                                            filter: `url(#profileShadow-${profile.id})`,
                                                            style: { cursor: 'pointer' },
                                                        }}
                                                        animationDuration={1200}
                                                        animationEasing="ease-out"
                                                    />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                        {/* Device Breakdown */}
                                        {Object.keys(profile.device_breakdown).length > 0 && (
                                            <div className="hidden sm:block">
                                                <h4 className="mb-4 flex items-center gap-2 text-sm font-semibold">
                                                    <Monitor className="h-3.5 w-3.5 text-slate-600" />
                                                    Device Breakdown
                                                </h4>
                                                <div className="space-y-4">
                                                    {Object.entries(profile.device_breakdown).map(([device, count]) => {
                                                        const total = Object.values(profile.device_breakdown).reduce((sum, c) => sum + c, 0);
                                                        const percentage = Math.round((count / total) * 100);

                                                        const deviceColors: Record<string, any> = {
                                                            mobile: {
                                                                bg: '#10B981',
                                                                light: '#D1FAE5',
                                                                text: '#065F46',
                                                                gradient: 'from-emerald-400 to-emerald-600',
                                                            },
                                                            desktop: {
                                                                bg: '#3B82F6',
                                                                light: '#DBEAFE',
                                                                text: '#1E3A8A',
                                                                gradient: 'from-blue-400 to-blue-600',
                                                            },
                                                            tablet: {
                                                                bg: '#F59E0B',
                                                                light: '#FEF3C7',
                                                                text: '#92400E',
                                                                gradient: 'from-amber-400 to-amber-600',
                                                            },
                                                        };

                                                        const colors = deviceColors[device.toLowerCase()] || {
                                                            bg: '#6B7280',
                                                            light: '#F3F4F6',
                                                            text: '#374151',
                                                            gradient: 'from-gray-400 to-gray-600',
                                                        };

                                                        return (
                                                            <div
                                                                key={device}
                                                                className="space-y-3 rounded-lg border border-gray-100 p-3 transition-all duration-200 hover:border-gray-200 hover:shadow-sm"
                                                            >
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className={`rounded-lg p-2`} style={{ backgroundColor: colors.light }}>
                                                                            {getDeviceIcon(device)}
                                                                        </div>
                                                                        <div>
                                                                            <span
                                                                                className="text-sm font-semibold capitalize"
                                                                                style={{ color: colors.text }}
                                                                            >
                                                                                {device}
                                                                            </span>
                                                                            <div className="text-muted-foreground text-xs">{count} visits</div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="text-right">
                                                                            <div className="text-sm font-bold" style={{ color: colors.text }}>
                                                                                {percentage}%
                                                                            </div>
                                                                            <Badge
                                                                                variant="outline"
                                                                                className="border text-xs"
                                                                                style={{
                                                                                    borderColor: colors.bg,
                                                                                    color: colors.text,
                                                                                }}
                                                                            >
                                                                                {count}
                                                                            </Badge>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                                                                    <div
                                                                        className={`h-2 bg-gradient-to-r ${colors.gradient} rounded-full shadow-sm transition-all duration-1000 ease-out`}
                                                                        style={{ width: `${percentage}%` }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                        {/* Recent Visits */}
                                        {profile.recent_visits.length > 0 && (
                                            <div>
                                                <h4 className="mb-3 text-sm font-medium">Recent Visits</h4>
                                                <div className="space-y-2">
                                                    {profile.recent_visits.slice(0, 3).map((visit) => (
                                                        <div key={visit.id} className="flex items-center justify-between text-sm">
                                                            <div className="flex items-center gap-2">
                                                                <MapPin className="text-muted-foreground h-3 w-3 flex-shrink-0" />
                                                                <span className="truncate">
                                                                    {visit.city && visit.country
                                                                        ? `${visit.city}, ${visit.country}`
                                                                        : visit.country || 'Unknown location'}
                                                                </span>
                                                            </div>
                                                            <div className="text-muted-foreground flex flex-shrink-0 items-center gap-1">
                                                                <Clock className="h-3 w-3" />
                                                                <span className="text-xs">{formatDate(visit.visited_at)}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AnalyticsData } from '@/types/admin/analytics';
import { BarChart3 } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface ActivityChartProps {
    activityData: AnalyticsData['activity']['last_7_days'];
}

export function ActivityChart({ activityData }: ActivityChartProps) {
    return (
        <Card className="border-0 shadow-lg md:col-span-1">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    7-Day Activity
                </CardTitle>
                <CardDescription>Daily creation of NFC codes and user registrations</CardDescription>
            </CardHeader>{' '}
            <CardContent>
                {/* Custom Legend */}
                <div className="mb-4 flex items-center justify-center space-x-8">
                    <div className="flex items-center">
                        <div className="mr-2 h-3 w-3 rounded-full bg-blue-500"></div>
                        <span className="text-sm font-medium text-blue-700">NFC Codes</span>
                    </div>
                    <div className="flex items-center">
                        <div className="mr-2 h-3 w-3 rounded-full bg-green-500"></div>
                        <span className="text-sm font-medium text-green-700">Users</span>
                    </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={activityData || []} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                        {' '}
                        <defs>
                            <linearGradient id="codesGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.9} />
                                <stop offset="50%" stopColor="#3B82F6" stopOpacity={0.4} />
                                <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.1} />
                            </linearGradient>
                            <linearGradient id="usersGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#10B981" stopOpacity={0.9} />
                                <stop offset="50%" stopColor="#10B981" stopOpacity={0.4} />
                                <stop offset="100%" stopColor="#10B981" stopOpacity={0.1} />
                            </linearGradient>
                            <filter id="dropShadow">
                                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#3B82F6" floodOpacity="0.2" />
                            </filter>
                            <filter id="usersShadow">
                                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#10B981" floodOpacity="0.2" />
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
                        <YAxis tick={{ fontSize: 11, fill: '#6b7280', fontWeight: '500' }} tickLine={false} axisLine={false} tickMargin={10} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                border: 'none',
                                borderRadius: '16px',
                                fontSize: '13px',
                                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                                padding: '16px',
                                backdropFilter: 'blur(8px)',
                            }}
                            labelStyle={{
                                color: '#1f2937',
                                fontWeight: '600',
                                fontSize: '13px',
                                marginBottom: '4px',
                            }}
                            cursor={{
                                stroke: '#3B82F6',
                                strokeWidth: 2,
                                strokeDasharray: '4 4',
                                filter: 'url(#dropShadow)',
                            }}
                            formatter={(value, name) => {
                                const color = name === 'NFC Codes' ? '#3B82F6' : '#10B981';
                                return [
                                    <span style={{ color, fontWeight: '700' }}>{value.toLocaleString()}</span>,
                                    <span style={{ color: '#6B7280' }}>{name}</span>,
                                ];
                            }}
                        />{' '}
                        <Area
                            type="monotone"
                            dataKey="nfc_codes"
                            stroke="#3B82F6"
                            strokeWidth={3}
                            fill="url(#codesGradient)"
                            name="NFC Codes"
                            activeDot={{
                                r: 6,
                                stroke: '#ffffff',
                                strokeWidth: 3,
                                fill: '#3B82F6',
                                filter: 'url(#dropShadow)',
                            }}
                            animationDuration={1500}
                            animationEasing="ease-out"
                        />{' '}
                        <Area
                            type="monotone"
                            dataKey="users"
                            stroke="#10B981"
                            strokeWidth={3}
                            fill="url(#usersGradient)"
                            name="Users"
                            activeDot={{
                                r: 6,
                                stroke: '#ffffff',
                                strokeWidth: 3,
                                fill: '#10B981',
                                filter: 'url(#usersShadow)',
                            }}
                            animationDuration={1500}
                            animationEasing="ease-out"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

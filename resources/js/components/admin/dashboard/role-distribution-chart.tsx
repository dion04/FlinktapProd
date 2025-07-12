import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RoleDataItem } from '@/types/admin/analytics';
import { Users } from 'lucide-react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

interface RoleDistributionChartProps {
    roleData: RoleDataItem[];
}

export function RoleDistributionChart({ roleData }: RoleDistributionChartProps) {
    return (
        <Card className="border-0 shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-purple-600" />
                    User Role Distribution
                </CardTitle>
                <CardDescription>Breakdown of users by role type</CardDescription>
            </CardHeader>
            <CardContent>
                {/* Custom Legend */}
                <div className="mb-4 flex flex-wrap items-center justify-center gap-4">
                    {roleData.map((role, index) => (
                        <div key={index} className="flex items-center">
                            <div className="mr-2 h-3 w-3 rounded-full" style={{ backgroundColor: role.color }}></div>
                            <span className="text-sm font-medium" style={{ color: role.color }}>
                                {role.name}
                            </span>
                        </div>
                    ))}
                </div>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <defs>
                            {roleData.map((entry, index) => (
                                <radialGradient key={`gradient-${index}`} id={`roleGradient-${index}`} cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                                    <stop offset="0%" stopColor={entry.gradientStart} stopOpacity={0.9} />
                                    <stop offset="100%" stopColor={entry.gradientEnd} stopOpacity={0.7} />
                                </radialGradient>
                            ))}
                            <filter id="pieGlow" x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
                                <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="glow" />
                                <feComposite in="SourceGraphic" in2="glow" operator="over" />
                            </filter>
                        </defs>
                        <Pie
                            data={roleData}
                            cx="50%"
                            cy="50%"
                            labelLine={{ stroke: '#9CA3AF', strokeWidth: 1, strokeDasharray: '2 2' }}
                            label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                            outerRadius={100}
                            innerRadius={60}
                            paddingAngle={3}
                            dataKey="value"
                            filter="url(#pieGlow)"
                            animationDuration={1500}
                            animationEasing="ease-out"
                        >
                            {roleData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={`url(#roleGradient-${index})`}
                                    stroke="#ffffff"
                                    strokeWidth={2}
                                    style={{ filter: `drop-shadow(${entry.shadow})` }}
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '13px',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                                padding: '12px',
                                backdropFilter: 'blur(4px)',
                            }}
                            formatter={(value, name, props) => {
                                // Check if props and payload exist and index is valid
                                const entry =
                                    props && props.payload && typeof props.payload.index === 'number' ? roleData[props.payload.index] : null;
                                return [
                                    <span style={{ fontWeight: 600, color: entry?.color || '#6B7280' }}>{value} users</span>,
                                    <span style={{ fontSize: '14px' }}>{name}</span>,
                                ];
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

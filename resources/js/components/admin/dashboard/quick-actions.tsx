import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, QrCode, Users } from 'lucide-react';

export function QuickActions() {
    return (
        <Card className="border-0 shadow-lg">
            <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-3 md:grid-cols-3">
                    <a
                        href="/admin/resolve-codes"
                        className="group flex items-center gap-3 rounded-lg border border-blue-100 bg-gradient-to-br from-blue-50 to-blue-100/50 p-4 shadow-sm transition-all duration-300 hover:from-blue-100/70 hover:to-blue-200/30 hover:shadow-md"
                    >
                        <div className="rounded-lg bg-blue-100 p-2 transition-colors duration-200 group-hover:bg-blue-200">
                            <QrCode className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <div className="font-medium text-blue-800">Manage NFC Codes</div>
                            <div className="text-muted-foreground text-sm">Create and assign codes</div>
                        </div>
                    </a>

                    <a
                        href="/admin/users"
                        className="group flex items-center gap-3 rounded-lg border border-purple-100 bg-gradient-to-br from-purple-50 to-purple-100/50 p-4 shadow-sm transition-all duration-300 hover:from-purple-100/70 hover:to-purple-200/30 hover:shadow-md"
                    >
                        <div className="rounded-lg bg-purple-100 p-2 transition-colors duration-200 group-hover:bg-purple-200">
                            <Users className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                            <div className="font-medium text-purple-800">User Management</div>
                            <div className="text-muted-foreground text-sm">Manage user roles</div>
                        </div>
                    </a>

                    <a
                        href="/admin/dashboard"
                        className="group flex items-center gap-3 rounded-lg border border-green-100 bg-gradient-to-br from-green-50 to-green-100/50 p-4 shadow-sm transition-all duration-300 hover:from-green-100/70 hover:to-green-200/30 hover:shadow-md"
                    >
                        <div className="rounded-lg bg-green-100 p-2 transition-colors duration-200 group-hover:bg-green-200">
                            <Activity className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                            <div className="font-medium text-green-800">Analytics</div>
                            <div className="text-muted-foreground text-sm">View detailed reports</div>
                        </div>
                    </a>
                </div>
            </CardContent>
        </Card>
    );
}

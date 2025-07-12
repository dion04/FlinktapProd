import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AnalyticsData } from '@/types/admin/analytics';
import { Clock } from 'lucide-react';

interface RecentNfcCodesTableProps {
    nfcCodes: AnalyticsData['recent']['nfc_codes'];
}

export function RecentNfcCodesTable({ nfcCodes }: RecentNfcCodesTableProps) {
    return (
        <Card className="border-0 shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    Recent NFC Codes
                </CardTitle>
                <CardDescription>Latest created NFC codes</CardDescription>
            </CardHeader>{' '}
            <CardContent>
                <div className="space-y-3">
                    {(nfcCodes || []).slice(0, 5).map((code) => (
                        <div
                            key={code.id}
                            className="flex items-center justify-between rounded-lg p-3 transition-all duration-200 hover:bg-blue-50/50 hover:shadow-sm"
                        >
                            <div className="flex flex-col">
                                <span className="font-mono text-sm font-medium text-gray-800">{code.code}</span>
                                <span className="text-muted-foreground text-xs">by {code.creator?.name || 'Unknown'}</span>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <Badge
                                    className={`${
                                        code.status === 'assigned'
                                            ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                                            : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
                                    }`}
                                >
                                    {code.status}
                                </Badge>
                                {code.user && <span className="text-muted-foreground text-xs">→ {code.user.name}</span>}
                            </div>
                        </div>
                    ))}
                    {(!nfcCodes || nfcCodes.length === 0) && <p className="text-muted-foreground py-4 text-center text-sm">No recent codes</p>}
                </div>
            </CardContent>
        </Card>
    );
}

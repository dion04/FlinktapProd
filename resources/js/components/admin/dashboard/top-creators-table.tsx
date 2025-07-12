import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AnalyticsData } from '@/types/admin/analytics';
import { Zap } from 'lucide-react';

interface TopCreatorsTableProps {
    creators: AnalyticsData['activity']['top_creators'];
}

export function TopCreatorsTable({ creators }: TopCreatorsTableProps) {
    return (
        <Card className="border-0 shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-amber-600" />
                    Top Code Creators
                </CardTitle>
                <CardDescription>
                    Users who created the most NFC codes
                    {/* Note: The backend query needs to be updated to only count non-deleted codes */}
                </CardDescription>
            </CardHeader>{' '}
            <CardContent>
                <div className="space-y-3">
                    {(creators || []).slice(0, 5).map((creator, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between rounded-lg p-3 transition-all duration-200 hover:bg-amber-50/50 hover:shadow-sm"
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-amber-200 text-sm font-semibold text-amber-700 shadow-sm">
                                    {index + 1}
                                </div>
                                <span className="font-medium text-gray-800">{creator.name}</span>
                            </div>
                            <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 px-3 py-1 text-white">{creator.codes_created} codes</Badge>
                        </div>
                    ))}
                    {(!creators || creators.length === 0) && <p className="text-muted-foreground py-4 text-center text-sm">No code creators yet</p>}
                </div>
            </CardContent>
        </Card>
    );
}

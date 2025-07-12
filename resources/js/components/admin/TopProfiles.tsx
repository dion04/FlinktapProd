import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatNumber } from '@/utils/format-utils';
import { Link } from '@inertiajs/react';
import { User } from 'lucide-react';

type TopProfilesProps = {
    topProfiles: Array<{
        id: number;
        display_name: string;
        slug: string;
        visits_count: number;
        unique_visitors: number;
        avatar_url?: string | null;
    }>;
};

export function TopProfiles({ topProfiles }: TopProfilesProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Top Performing Profiles</CardTitle>
                <CardDescription>Profiles with the most visits</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {topProfiles.slice(0, 5).map((profile) => (
                        <div key={profile.id} className="flex items-center justify-between rounded-lg border p-4">
                            <div className="flex items-center gap-3">
                                {profile.avatar_url ? (
                                    <img src={profile.avatar_url} alt={profile.display_name} className="h-10 w-10 rounded-full object-cover" />
                                ) : (
                                    <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
                                        <User className="text-muted-foreground h-5 w-5" />
                                    </div>
                                )}
                                <div>
                                    <div className="font-medium">
                                        <Link href={`/profile/${profile.slug}`} className="hover:underline">
                                            {profile.display_name}
                                        </Link>
                                    </div>
                                    <div className="text-muted-foreground text-sm">/{profile.slug}</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-semibold">{formatNumber(profile.visits_count)} visits</div>
                                <div className="text-muted-foreground text-sm">{profile.unique_visitors} unique</div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

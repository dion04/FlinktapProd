import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { Edit } from 'lucide-react';
import React from 'react';

interface ProfileHeaderProps {
    profile: any;
    isOwner: boolean;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile, isOwner }) => (
    <div className="flex flex-col items-center space-y-4">
        <Avatar className="h-24 w-24">
            {profile.avatar_url && <AvatarImage src={profile.avatar_url} alt={`${profile.first_name} ${profile.last_name}`} />}
            <AvatarFallback className="text-2xl">{`${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase()}</AvatarFallback>
        </Avatar>

        <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold text-gray-900">{`${profile.first_name} ${profile.last_name}`}</h1>
            <div className="flex items-center justify-center space-x-2">
                <Badge variant="secondary" className="text-xs">
                    {profile.resolve_code.code}
                </Badge>
                {!profile.is_public && (
                    <Badge variant="outline" className="text-xs">
                        Private
                    </Badge>
                )}
            </div>
        </div>

        {isOwner && (
            <Link href={route('profile.edit', profile.slug)}>
                <Button variant="outline" size="sm">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                </Button>
            </Link>
        )}
    </div>
);

export default ProfileHeader;

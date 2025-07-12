import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { type User } from '@/types';

export function UserInfo({ user, showEmail = false, showRole = false }: { user: User; showEmail?: boolean; showRole?: boolean }) {
    const getInitials = useInitials();

    return (
        <>
            <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg bg-neutral-200 text-black">{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <div className="flex items-center gap-2">
                    <span className="truncate font-medium">{user.name}</span>
                </div>
                {showEmail && <span className="text-muted-foreground truncate text-xs">{user.email}</span>}
            </div>
        </>
    );
}

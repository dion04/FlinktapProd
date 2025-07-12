import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate, formatNumber } from '@/utils/format-utils';
import { Link } from '@inertiajs/react';
import { Globe, Lock, Pencil, Trash2, User } from 'lucide-react';

interface Profile {
    id: number;
    first_name: string;
    last_name: string;
    avatar_url: string | null;
    slug: string;
    user: {
        name: string;
        email: string;
    };
    resolve_code?: {
        code: string;
    } | null;
    is_public: boolean;
    visit_count: number;
    unique_visitors: number;
    created_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface ProfilesData {
    data: Profile[];
    links?: PaginationLink[];
}

interface ProfileTableProps {
    profiles: ProfilesData;
    selected: number[];
    onSelectItem: (id: number, checked: boolean) => void;
    onSelectAll: (checked: boolean) => void;
    onConfirmDelete: (ids: number[]) => void;
    onSortChange: (column: string) => void;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    router: any;
}

export default function ProfileTable({
    profiles,
    selected,
    onSelectItem,
    onSelectAll,
    onConfirmDelete,
    onSortChange,
    sortBy,
    sortOrder,
    router,
}: ProfileTableProps) {
    const handleSelectItem = (id: number, checked: boolean) => {
        onSelectItem(id, checked);
    };

    const handleSelectAll = (checked: boolean) => {
        onSelectAll(checked);
    };

    const handleSortChange = (column: string) => {
        onSortChange(column);
    };

    return (
        <>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b">
                            <th className="p-2 text-left">
                                <input
                                    type="checkbox"
                                    checked={selected.length === profiles.data.length && profiles.data.length > 0}
                                    onChange={(e) => handleSelectAll(e.target.checked)}
                                    className="rounded border-gray-300"
                                />
                            </th>{' '}
                            <th className="hover:bg-muted/50 cursor-pointer p-2 text-left" onClick={() => handleSortChange('last_name')}>
                                Profile Name
                                {sortBy === 'last_name' && <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                            </th>
                            <th className="hover:bg-muted/50 cursor-pointer p-2 text-left" onClick={() => handleSortChange('user')}>
                                User
                                {sortBy === 'user' && <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                            </th>
                            <th className="p-2 text-left">Code</th>
                            <th className="p-2 text-left">Status</th>
                            <th className="hover:bg-muted/50 cursor-pointer p-2 text-left" onClick={() => handleSortChange('visits')}>
                                Visits
                                {sortBy === 'visits' && <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                            </th>
                            <th className="hover:bg-muted/50 cursor-pointer p-2 text-left" onClick={() => handleSortChange('created_at')}>
                                Created
                                {sortBy === 'created_at' && <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                            </th>
                            <th className="p-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {profiles.data.map((profile) => (
                            <tr key={profile.id} className="hover:bg-muted/30 border-b">
                                <td className="p-2">
                                    <input
                                        type="checkbox"
                                        checked={selected.includes(profile.id)}
                                        onChange={(e) => handleSelectItem(profile.id, e.target.checked)}
                                        className="rounded border-gray-300"
                                    />
                                </td>
                                <td className="p-2">
                                    <div className="flex items-center gap-3">
                                        {profile.avatar_url ? (
                                            <img
                                                src={profile.avatar_url}
                                                alt={`${profile.first_name} ${profile.last_name}`}
                                                className="h-8 w-8 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-full">
                                                <User className="text-muted-foreground h-4 w-4" />
                                            </div>
                                        )}
                                        <div>
                                            <div className="font-medium">{`${profile.first_name} ${profile.last_name}`}</div>
                                            <div className="text-muted-foreground text-sm">/{profile.slug}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-2">
                                    <div>
                                        <div className="font-medium">{profile.user.name}</div>
                                        <div className="text-muted-foreground text-sm">{profile.user.email}</div>
                                    </div>{' '}
                                </td>
                                <td className="p-2">
                                    <code className="bg-muted rounded px-2 py-1 text-sm">{profile.resolve_code?.code || 'N/A'}</code>
                                </td>{' '}
                                <td className="p-2">
                                    <Badge
                                        variant={profile.is_public ? 'default' : 'secondary'}
                                        className={`${
                                            profile.is_public
                                                ? 'bg-green-600 text-white hover:bg-green-700 dark:bg-green-600 dark:text-white dark:hover:bg-green-700'
                                                : 'bg-orange-600 text-white hover:bg-orange-700 dark:bg-orange-600 dark:text-white dark:hover:bg-orange-700'
                                        } font-medium transition-colors duration-200`}
                                    >
                                        {profile.is_public ? (
                                            <>
                                                <Globe className="h-3 w-3" />
                                                <span>Public</span>
                                            </>
                                        ) : (
                                            <>
                                                <Lock className="h-3 w-3" />
                                                <span>Private</span>
                                            </>
                                        )}
                                    </Badge>
                                </td>
                                <td className="p-2">
                                    <div className="flex flex-col">
                                        <div className="font-medium">{formatNumber(profile.visit_count)}</div>
                                        <div className="text-muted-foreground text-xs">{formatNumber(profile.unique_visitors)} unique</div>
                                    </div>
                                </td>
                                <td className="p-2">
                                    <div className="whitespace-nowrap">{formatDate(profile.created_at)}</div>
                                </td>{' '}
                                <td className="p-2">
                                    <div className="flex items-center space-x-2">
                                        <Link
                                            href={`/profile/${profile.slug}/edit`}
                                            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-blue-600 hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-900/20"
                                            title="Edit Profile"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Link>{' '}
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0 text-red-600 hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-900/20"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();

                                                onConfirmDelete([profile.id]);
                                            }}
                                            title="Delete Profile"
                                            type="button"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {profiles.links && (
                <div className="mt-4 flex justify-center">
                    <div className="flex space-x-1">
                        {profiles.links.map((link, index) => (
                            <Button
                                key={index}
                                variant={link.active ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => link.url && router.get(link.url)}
                                disabled={!link.url}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}

import { Breadcrumbs } from '@/components/breadcrumbs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useDebounce } from '@/hooks/useDebounce';
import AppLayout from '@/layouts/app-layout';
import { Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

type User = {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
};

type UsersProp = {
    data: User[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
};

interface UserManagementIndexProps {
    users: UsersProp;
    filters: {
        search: string;
        role: string;
    };
}

function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function getRoleBadgeStyle(role: string) {
    switch (role) {
        case 'superadmin':
            return 'bg-purple-100 text-purple-800';
        case 'admin':
            return 'bg-blue-100 text-blue-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
}

export default function UserManagementIndex({ users, filters }: UserManagementIndexProps) {
    const [searchValue, setSearchValue] = useState(filters.search);
    const [roleFilter, setRoleFilter] = useState(filters.role || 'all');
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [processing, setProcessing] = useState(false);

    const { data: roleData, setData: setRoleData, patch, reset: resetRole } = useForm({ role: '' });
    const { delete: deleteUser } = useForm(); // Debounced search function with 300ms delay
    const debouncedSearch = useDebounce((searchTerm: string, role: string) => {
        const filterParams = {
            search: searchTerm,
            role: role === 'all' ? '' : role,
        };

        router.get(route('admin.users.index'), filterParams, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    }, 300);

    const handleSearchChange = (value: string) => {
        setSearchValue(value);
        debouncedSearch(value, roleFilter);
    };

    const handleRoleFilterChange = (value: string) => {
        setRoleFilter(value);
        debouncedSearch(searchValue, value);
    };

    const openRoleModal = (user: User) => {
        setSelectedUser(user);
        setRoleData('role', user.role);
        setShowRoleModal(true);
    };

    const openDeleteModal = (user: User) => {
        setSelectedUser(user);
        setShowDeleteModal(true);
    };

    const handleRoleUpdate = () => {
        if (!selectedUser) return;

        setProcessing(true);
        patch(route('admin.users.update-role', selectedUser.id), {
            onSuccess: () => {
                setShowRoleModal(false);
                setSelectedUser(null);
                resetRole();
                setProcessing(false);
            },
            onError: () => {
                setProcessing(false);
            },
        });
    };

    const handleUserDelete = () => {
        if (!selectedUser) return;

        setProcessing(true);
        deleteUser(route('admin.users.destroy', selectedUser.id), {
            onSuccess: () => {
                setShowDeleteModal(false);
                setSelectedUser(null);
                setProcessing(false);
            },
            onError: () => {
                setProcessing(false);
            },
        });
    };
    return (
        <AppLayout>
            <div className="mx-auto w-[90%] max-w-full p-6">
                <Breadcrumbs
                    breadcrumbs={[
                        { title: 'Dashboard', href: route('dashboard') },
                        { title: 'User Management', href: route('admin.users.index') },
                    ]}
                />
                <h1 className="mt-4 mb-4 text-2xl font-bold">User Management</h1>
                <p className="mb-6 text-sm text-gray-600">Manage user roles and permissions. Only super admins can access this page.</p>
                <Separator className="my-4" />
                {/* Table with proper background styling */}
                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                    {/* Search and Filter section */}
                    <div className="border-b border-gray-200 bg-white px-4 pt-4 pb-4">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 20 20">
                                            <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                            />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        className="block w-80 rounded-lg border border-gray-300 bg-gray-50 p-2 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="Search users by name or email"
                                        value={searchValue}
                                        onChange={(e) => handleSearchChange(e.target.value)}
                                    />
                                </div>
                                <Select value={roleFilter} onValueChange={handleRoleFilterChange}>
                                    <SelectTrigger className="w-48">
                                        <SelectValue placeholder="Filter by role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Roles</SelectItem>
                                        <SelectItem value="user">User</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                        <SelectItem value="superadmin">Super Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full bg-white text-left text-sm text-gray-500">
                            <thead className="border-b border-gray-200 bg-gray-50 text-xs text-gray-700 uppercase">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        Name
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Email
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Role
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Joined
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {users.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="text-muted-foreground bg-white px-6 py-6 text-center">
                                            No users found.
                                        </td>
                                    </tr>
                                ) : (
                                    users.data.map((user: User) => (
                                        <tr key={user.id} className="bg-white transition-colors hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                                            <td className="px-6 py-4">{user.email}</td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${getRoleBadgeStyle(user.role)}`}
                                                >
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-xs text-gray-500">{formatDate(user.created_at)}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Button variant="outline" size="sm" onClick={() => openRoleModal(user)} className="text-xs">
                                                        Change Role
                                                    </Button>
                                                    <Button variant="destructive" size="sm" onClick={() => openDeleteModal(user)} className="text-xs">
                                                        Delete
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                {/* Pagination Controls */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                    <div className="text-muted-foreground text-xs">
                        Showing {users.from}–{users.to} of {users.total} users
                    </div>
                    <nav className="flex flex-wrap gap-1" aria-label="Pagination">
                        {users.links.map((link, idx) => {
                            let label = link.label.replace(/&laquo;|&raquo;/g, '').trim();
                            if (link.label.includes('&laquo;')) label = '‹';
                            if (link.label.includes('&raquo;')) label = '›';
                            return (
                                <Link
                                    key={idx}
                                    href={link.url || ''}
                                    className={`rounded px-2 py-1 text-xs ${
                                        link.active ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                                    } ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
                                    preserveScroll
                                >
                                    {label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
                {/* Role Change Modal */}
                {showRoleModal && selectedUser && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                        <div className="max-w-[90vw] min-w-[400px] rounded-lg bg-white p-6 shadow-lg">
                            <h2 className="mb-2 text-lg font-semibold">Change User Role</h2>
                            <p className="text-muted-foreground mb-4 text-sm">
                                Change the role for <strong>{selectedUser.name}</strong>
                            </p>
                            <div className="mb-4">
                                <Select value={roleData.role} onValueChange={(value) => setRoleData('role', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="user">User</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                        <SelectItem value="superadmin">Super Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="secondary" size="sm" onClick={() => setShowRoleModal(false)} disabled={processing}>
                                    Cancel
                                </Button>
                                <Button type="button" variant="default" size="sm" onClick={handleRoleUpdate} disabled={processing || !roleData.role}>
                                    {processing ? 'Updating...' : 'Update Role'}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
                {/* Delete Confirmation Modal */}
                {showDeleteModal && selectedUser && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                        <div className="max-w-[90vw] min-w-[400px] rounded-lg bg-white p-6 shadow-lg">
                            <h2 className="mb-2 text-lg font-semibold">Delete User</h2>
                            <p className="text-muted-foreground mb-4 text-sm">
                                Are you sure you want to delete <strong>{selectedUser.name}</strong>? This action cannot be undone.
                            </p>
                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="secondary" size="sm" onClick={() => setShowDeleteModal(false)} disabled={processing}>
                                    Cancel
                                </Button>
                                <Button type="button" variant="destructive" size="sm" onClick={handleUserDelete} disabled={processing}>
                                    {processing ? 'Deleting...' : 'Delete User'}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

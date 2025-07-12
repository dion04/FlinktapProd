import { Breadcrumbs } from '@/components/breadcrumbs';
import { Separator } from '@/components/ui/separator';
import { useDebounce } from '@/hooks/useDebounce';
import AppLayout from '@/layouts/app-layout';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';

type User = { name: string };
type Batch = {
    id: number;
    name: string;
    prefix: string | null;
    count: number;
    created_at: string;
    creator: User;
    resolve_codes: Array<{
        id: number;
        code: string;
        status: string;
        user?: User | null;
    }>;
};

type BatchesProp = {
    data: Batch[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
};

interface BatchesIndexProps {
    batches: BatchesProp;
    filters: {
        search: string;
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

export default function BatchesIndex({ batches, filters }: BatchesIndexProps) {
    const [searchValue, setSearchValue] = useState(filters.search);
    const [deleting, setDeleting] = useState<number | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);

    // Debounced search function with 300ms delay
    const debouncedSearch = useDebounce((searchTerm: string) => {
        router.get(
            route('admin.batches.index'),
            { search: searchTerm },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    }, 300);

    const handleSearchChange = (value: string) => {
        setSearchValue(value);
        debouncedSearch(value);
    };
    const openDeleteModal = (batch: Batch) => {
        setSelectedBatch(batch);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        if (!selectedBatch) return;

        setDeleting(selectedBatch.id);
        try {
            await fetch(route('admin.batches.destroy', selectedBatch.id), {
                method: 'DELETE',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name=csrf-token]') as HTMLMetaElement)?.content || '',
                },
            });
            setShowDeleteModal(false);
            setSelectedBatch(null);
            window.location.reload();
        } catch (error) {
            console.error('Error deleting batch:', error);
        } finally {
            setDeleting(null);
        }
    };

    return (
        <AppLayout>
            <div className="mx-auto w-[90%] max-w-full p-6">
                <Breadcrumbs
                    breadcrumbs={[
                        { title: 'Dashboard', href: route('dashboard') },
                        { title: 'Resolve Codes', href: route('admin.resolve-codes.index') },
                        { title: 'Batches', href: route('admin.batches.index') },
                    ]}
                />
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Code Batches</h1>
                        <p className="text-sm text-gray-600">View and manage your resolve code batches</p>
                    </div>
                    <Link
                        href={route('admin.resolve-codes.index')}
                        className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add New Codes
                    </Link>
                </div>

                <Separator className="my-4" />

                {/* Stats Cards */}
                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-500 text-white">
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                        />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-500">Total Batches</p>
                                <p className="text-lg font-semibold text-gray-900">{batches.total}</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-green-500 text-white">
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-500">Total Codes</p>
                                <p className="text-lg font-semibold text-gray-900">{batches.data.reduce((sum, batch) => sum + batch.count, 0)}</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-purple-500 text-white">
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-500">Assigned Codes</p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {batches.data.reduce(
                                        (sum, batch) => sum + batch.resolve_codes.filter((code) => code.status === 'assigned').length,
                                        0,
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                    {/* Search section */}
                    <div className="border-b border-gray-200 bg-white px-4 pt-4 pb-4">
                        <label htmlFor="table-search" className="sr-only">
                            Search
                        </label>
                        <div className="relative mt-1 w-full max-w-xs">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <svg className="h-4 w-4 text-gray-500" aria-hidden="true" fill="none" viewBox="0 0 20 20">
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
                                id="table-search"
                                className="block w-80 rounded-lg border border-gray-300 bg-gray-50 p-2 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                                placeholder="Search batches, prefixes, or creators"
                                value={searchValue}
                                onChange={(e) => handleSearchChange(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full bg-white text-left text-sm text-gray-500">
                            <thead className="border-b border-gray-200 bg-gray-50 text-xs text-gray-700 uppercase">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        Batch Name
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Prefix
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Codes Count
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Assigned
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Created By
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Created At
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {batches.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="text-muted-foreground bg-white px-6 py-6 text-center">
                                            No batches found.
                                        </td>
                                    </tr>
                                ) : (
                                    batches.data.map((batch: Batch) => {
                                        const assignedCount = batch.resolve_codes.filter((code) => code.status === 'assigned').length;
                                        return (
                                            <tr key={batch.id} className="bg-white transition-colors hover:bg-gray-50">
                                                <td className="px-6 py-4 font-medium text-gray-900">
                                                    <Link
                                                        href={route('admin.batches.show', batch.id)}
                                                        className="text-blue-600 hover:text-blue-800 hover:underline"
                                                    >
                                                        {batch.name}
                                                    </Link>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {batch.prefix ? (
                                                        <span className="inline-block rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800">
                                                            {batch.prefix}
                                                        </span>
                                                    ) : (
                                                        <span className="text-muted-foreground">-</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-block rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                                                        {batch.count} codes
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <span
                                                            className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
                                                                assignedCount > 0 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                            }`}
                                                        >
                                                            {assignedCount} / {batch.count}
                                                        </span>
                                                        <div className="h-1.5 w-16 rounded-full bg-gray-200">
                                                            <div
                                                                className="h-1.5 rounded-full bg-green-600"
                                                                style={{ width: `${(assignedCount / batch.count) * 100}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">{batch.creator.name}</td>
                                                <td className="px-6 py-4 text-xs text-gray-500">{formatDate(batch.created_at)}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <Link
                                                            href={route('admin.batches.show', batch.id)}
                                                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-blue-600 transition-all duration-200 hover:border-blue-300 hover:bg-blue-100"
                                                            title="View batch details"
                                                        >
                                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                                />
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                                />
                                                            </svg>
                                                        </Link>
                                                        <button
                                                            type="button"
                                                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 transition-all duration-200 hover:border-red-300 hover:bg-red-100 focus:ring-2 focus:ring-red-500 focus:ring-offset-1 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                                            title="Delete batch"
                                                            onClick={() => openDeleteModal(batch)}
                                                            disabled={deleting === batch.id}
                                                        >
                                                            {deleting === batch.id ? (
                                                                <svg
                                                                    className="h-4 w-4 animate-spin"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <circle
                                                                        className="opacity-25"
                                                                        cx="12"
                                                                        cy="12"
                                                                        r="10"
                                                                        stroke="currentColor"
                                                                        strokeWidth="4"
                                                                    ></circle>
                                                                    <path
                                                                        className="opacity-75"
                                                                        fill="currentColor"
                                                                        d="M4 12a8 8 0 018-8V0l3 3-3 3v4z"
                                                                    ></path>
                                                                </svg>
                                                            ) : (
                                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={2}
                                                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                                    />
                                                                </svg>
                                                            )}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination Controls */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                    <div className="text-muted-foreground text-xs">
                        Showing {batches.from}–{batches.to} of {batches.total} batches
                    </div>
                    <nav className="flex flex-wrap gap-1" aria-label="Pagination">
                        {batches.links.map((link, idx) => {
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

                {/* Delete Confirmation Modal */}
                {showDeleteModal && selectedBatch && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                        <div className="max-w-[90vw] min-w-[400px] rounded-lg bg-white p-6 shadow-lg">
                            <h2 className="mb-2 text-lg font-semibold">Delete Batch</h2>
                            <p className="text-muted-foreground mb-4 text-sm">
                                Are you sure you want to delete batch <strong>{selectedBatch.name}</strong>? This will not delete the codes, only the
                                batch record. This action cannot be undone.
                            </p>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    className="rounded bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                                    onClick={() => setShowDeleteModal(false)}
                                    disabled={deleting === selectedBatch.id}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="rounded bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                                    onClick={handleDelete}
                                    disabled={deleting === selectedBatch.id}
                                >
                                    {deleting === selectedBatch.id ? 'Deleting...' : 'Delete Batch'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

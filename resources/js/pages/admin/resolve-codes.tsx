import { Breadcrumbs } from '@/components/breadcrumbs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useDebounce } from '@/hooks/useDebounce';
import AppLayout from '@/layouts/app-layout';
import { Link, router, useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

type User = { name: string };
type Code = {
    id: number | string;
    code: string;
    status: string;
    user?: User | null;
    type: string;
    created_at: string;
    created_by?: number | null;
    creator?: User | null;
    assigned_at?: string | null;
    copied_at?: string | null;
};
type CodesProp = {
    data: Code[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
};
interface ResolveCodesIndexProps {
    codes: CodesProp;
    filters: {
        search: string;
    };
}

function randomSuffix(length = 7) {
    return Math.random()
        .toString()
        .slice(2, 2 + length);
}

function formatDate(dateString: string | null) {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export default function ResolveCodesIndex({ codes, filters }: ResolveCodesIndexProps) {
    const [amount, setAmount] = useState(10);
    const [success, setSuccess] = useState(false);
    const [selected, setSelected] = useState<(number | string)[]>([]);
    const [deleting, setDeleting] = useState(false);
    const [copying, setCopying] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [copySuccess, setCopySuccess] = useState<string | null>(null);
    const [pendingDelete, setPendingDelete] = useState<(number | string)[]>([]);
    const [searchValue, setSearchValue] = useState(filters.search);
    const cancelButtonRef = useRef<HTMLButtonElement>(null);
    const { data, setData, post, processing, reset, errors } = useForm({ prefix: '', codes: [] as string[] });
    const allIds = codes.data.map((c) => c.id);
    const allSelected = selected.length === allIds.length && allIds.length > 0;
    const isIndeterminate = selected.length > 0 && selected.length < allIds.length;
    const toggleSelectAll = () => {
        setSelected(allSelected ? [] : allIds);
    };
    const toggleSelect = (id: number | string) => {
        setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    };

    // Debounced search function with 300ms delay
    const debouncedSearch = useDebounce((searchTerm: string) => {
        router.get(
            route('admin.resolve-codes.index'),
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

    const confirmDelete = (ids: (number | string)[]) => {
        setPendingDelete(ids);
        setShowModal(true);
    };

    const handleDeleteConfirmed = async () => {
        setShowModal(false);
        setDeleting(true);
        const url = route('admin.resolve-codes.destroy', pendingDelete.join(','));
        await fetch(url, {
            method: 'DELETE',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': (document.querySelector('meta[name=csrf-token]') as HTMLMetaElement)?.content || '',
            },
        });
        setDeleting(false);
        setSelected([]);
        setPendingDelete([]);
        window.location.reload();
    };
    const handleBulkGenerate = () => {
        if (!data.prefix) return;
        const generated = Array.from({ length: amount }, () => `${data.prefix}${randomSuffix()}`);
        setData('codes', generated);
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSuccess(false);
        post(route('admin.resolve-codes.store'), {
            onSuccess: () => {
                reset();
                setSuccess(true);
            },
        });
    };
    const copyToClipboard = async (text: string, id?: number | string) => {
        try {
            await navigator.clipboard.writeText(text);

            // For a single code, show the full code; for multiple, show the count
            if (id) {
                setCopySuccess(`Copied: ${text}`);
            } else {
                const codeCount = text.split(', ').length;
                setCopySuccess(`Copied ${codeCount} codes to clipboard`);
            }

            // Clear success message after 3 seconds
            setTimeout(() => {
                setCopySuccess(null);
            }, 3000);

            // If an ID is provided, mark this code as copied
            if (id) {
                markAsCopied([id]);
            }

            return true;
        } catch (err) {
            console.error('Failed to copy text: ', err);
            return false;
        }
    };

    const copySelectedCodes = async () => {
        if (selected.length === 0) return;

        setCopying(true); // Find the codes from the selected IDs
        const codesToCopy = codes.data.filter((code) => selected.includes(code.id)).map((code) => code.code);

        // Copy them to clipboard with comma and space separator
        const success = await copyToClipboard(codesToCopy.join(', '));

        if (success) {
            // Mark all selected codes as copied
            await markAsCopied(selected);
        }

        setCopying(false);
    };

    const markAsCopied = async (ids: (number | string)[]) => {
        try {
            const response = await fetch(route('admin.resolve-codes.mark-as-copied'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name=csrf-token]') as HTMLMetaElement)?.content || '',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({ ids }),
            });

            if (response.ok) {
                // Refresh the page to show updated copied status
                router.reload();
            }
        } catch (error) {
            console.error('Error marking codes as copied:', error);
        }
    };

    return (
        <AppLayout>
            <div className="mx-auto w-[90%] max-w-full p-6">
                <Breadcrumbs
                    breadcrumbs={[
                        { title: 'Dashboard', href: route('dashboard') },
                        { title: 'Resolve Codes', href: route('admin.resolve-codes.index') },
                    ]}
                />
                <h1 className="mt-4 mb-4 text-2xl font-bold">Resolve Codes</h1>{' '}
                <p className="mb-6 text-sm text-gray-600">Manage resolve codes. Only admins and super admins can access this page.</p>{' '}
                <form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end">
                    <Input
                        type="text"
                        value={data.prefix}
                        onChange={(e) => setData('prefix', e.target.value)}
                        className="w-24"
                        placeholder="Prefix"
                        aria-label="Prefix"
                    />
                    <Select value={amount.toString()} onValueChange={(val) => setAmount(Number(val))}>
                        <SelectTrigger className="w-28" aria-label="Amount">
                            <SelectValue placeholder="Amount" />
                        </SelectTrigger>
                        <SelectContent>
                            {[10, 20, 50, 100].map((n) => (
                                <SelectItem key={n} value={n.toString()}>
                                    {n} codes
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="px-2 py-1 text-xs"
                        onClick={handleBulkGenerate}
                        disabled={!data.prefix}
                    >
                        Generate
                    </Button>
                    <Button type="submit" variant="default" size="sm" className="px-4 py-1" disabled={processing || !data.codes.length}>
                        {processing ? 'Adding...' : 'Add'}
                    </Button>
                    <Link
                        href={route('admin.batches.index')}
                        className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-xs font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                            />
                        </svg>
                        View Batches
                    </Link>
                </form>{' '}
                {success && <div className="mb-2 rounded bg-green-100 px-2 py-1 text-xs text-green-800">Codes added successfully!</div>}
                {data.codes.length > 0 && (
                    <div className="mb-2 rounded-lg border border-blue-200 bg-blue-50 p-4">
                        <div className="mb-2 flex items-center gap-2">
                            <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                            <span className="font-medium text-blue-900">Ready to Add ({data.codes.length} codes)</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                            {data.codes.map((code, index) => (
                                <div key={index} className="rounded bg-white px-2 py-1 font-mono text-xs text-gray-700 shadow-sm">
                                    {code}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {errors.codes && <div className="mb-2 text-red-500">{errors.codes}</div>}
                <Separator className="my-4" />{' '}
                <div className="mb-2 flex items-center gap-2">
                    <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="flex items-center gap-2 px-4 py-2 transition-all duration-200 hover:shadow-md disabled:opacity-50"
                        disabled={selected.length === 0 || deleting}
                        onClick={() => confirmDelete(selected)}
                    >
                        {deleting ? (
                            <>
                                <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0l3 3-3 3v4z"></path>
                                </svg>
                                Deleting...
                            </>
                        ) : (
                            <>
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                </svg>
                                Delete Selected ({selected.length})
                            </>
                        )}
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 px-4 py-2 transition-all duration-200 hover:shadow-md disabled:opacity-50"
                        disabled={selected.length === 0 || copying}
                        onClick={copySelectedCodes}
                    >
                        {copying ? (
                            <>
                                <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0l3 3-3 3v4z"></path>
                                </svg>
                                Copying...
                            </>
                        ) : (
                            <>
                                {' '}
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                    />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14h6m-3-3v6" />
                                </svg>
                                Copy Selected ({selected.length})
                            </>
                        )}
                    </Button>

                    {copySuccess && <div className="ml-2 rounded bg-green-100 px-2 py-1 text-xs text-green-800">{copySuccess}</div>}
                </div>
                {/* Table with proper background styling */}{' '}
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
                                placeholder="Search for codes, users, or types"
                                value={searchValue}
                                onChange={(e) => handleSearchChange(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        {' '}
                        <table className="w-full bg-white text-left text-sm text-gray-500">
                            <thead className="border-b border-gray-200 bg-gray-50 text-xs text-gray-700 uppercase">
                                <tr>
                                    <th scope="col" className="p-4">
                                        <div className="flex items-center">
                                            <input
                                                id="checkbox-all-search"
                                                type="checkbox"
                                                checked={allSelected}
                                                ref={(el) => {
                                                    if (el) el.indeterminate = isIndeterminate;
                                                }}
                                                onChange={toggleSelectAll}
                                                className="h-4 w-4 rounded-sm border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
                                            />
                                            <label htmlFor="checkbox-all-search" className="sr-only">
                                                checkbox
                                            </label>
                                        </div>
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Code
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Linked User
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Type
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Created By
                                    </th>{' '}
                                    <th scope="col" className="px-6 py-3">
                                        Created At
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Linked At
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Copied
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {processing ? (
                                    <tr>
                                        <td colSpan={9} className="text-muted-foreground bg-white px-6 py-6 text-center">
                                            Loading...
                                        </td>
                                    </tr>
                                ) : codes.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="text-muted-foreground bg-white px-6 py-6 text-center">
                                            No codes found.
                                        </td>
                                    </tr>
                                ) : (
                                    codes.data.map((code: Code, i: number) => (
                                        <tr key={code.id} className="bg-white transition-colors hover:bg-gray-50">
                                            <td className="w-4 p-4">
                                                <div className="flex items-center">
                                                    <input
                                                        id={`checkbox-table-search-${code.id}`}
                                                        type="checkbox"
                                                        checked={selected.includes(code.id)}
                                                        onChange={() => toggleSelect(code.id)}
                                                        className="h-4 w-4 rounded-sm border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
                                                    />
                                                    <label htmlFor={`checkbox-table-search-${code.id}`} className="sr-only">
                                                        checkbox
                                                    </label>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-medium whitespace-nowrap text-gray-900">{code.code}</td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
                                                        code.status === 'assigned' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                    }`}
                                                >
                                                    {code.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {code.user ? code.user.name : <span className="text-muted-foreground">-</span>}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
                                                        code.type === 'nfc' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                                                    }`}
                                                >
                                                    {code.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {code.creator ? code.creator.name : <span className="text-muted-foreground">-</span>}
                                            </td>
                                            <td className="px-6 py-4 text-xs text-gray-500">{formatDate(code.created_at)}</td>{' '}
                                            <td className="px-6 py-4 text-xs text-gray-500">
                                                {code.assigned_at ? formatDate(code.assigned_at) : <span className="text-muted-foreground">-</span>}
                                            </td>
                                            <td className="px-6 py-4">
                                                {code.copied_at ? (
                                                    <span className="inline-block rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                                                        {formatDate(code.copied_at)}
                                                    </span>
                                                ) : (
                                                    <span className="text-muted-foreground">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex space-x-2">
                                                    <button
                                                        type="button"
                                                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-blue-600 transition-all duration-200 hover:border-blue-300 hover:bg-blue-100 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                                        title="Copy code"
                                                        onClick={() => copyToClipboard(code.code, code.id)}
                                                        aria-label={`Copy code ${code.code}`}
                                                    >
                                                        {' '}
                                                        <svg
                                                            className="h-4 w-4"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                                            />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14h6m-3-3v6" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 transition-all duration-200 hover:border-red-300 hover:bg-red-100 focus:ring-2 focus:ring-red-500 focus:ring-offset-1 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                                        title="Delete code"
                                                        onClick={() => confirmDelete([code.id])}
                                                        disabled={deleting}
                                                        aria-label={`Delete code ${code.code}`}
                                                    >
                                                        <svg
                                                            className="h-4 w-4"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                            />
                                                        </svg>
                                                    </button>
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
                        Showing {codes.from}–{codes.to} of {codes.total} codes
                    </div>
                    <nav className="flex flex-wrap gap-1" aria-label="Pagination">
                        {codes.links.map((link, idx) => {
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
                {/* Confirm Modal */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                        <div className="max-w-[90vw] min-w-[320px] rounded-lg bg-white p-6 shadow-lg">
                            <h2 className="mb-2 text-lg font-semibold">Confirm Delete</h2>
                            <p className="text-muted-foreground mb-4 text-sm">
                                Are you sure you want to delete {pendingDelete.length} code{pendingDelete.length > 1 ? 's' : ''}? This cannot be
                                undone.
                            </p>
                            <div className="flex justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="sm"
                                    ref={cancelButtonRef}
                                    onClick={() => setShowModal(false)}
                                    disabled={deleting}
                                >
                                    Cancel
                                </Button>
                                <Button type="button" variant="destructive" size="sm" onClick={handleDeleteConfirmed} disabled={deleting}>
                                    {deleting ? 'Deleting...' : 'Delete'}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

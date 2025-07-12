import { Breadcrumbs } from '@/components/breadcrumbs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';
import { useState } from 'react';

type User = { name: string };
type ResolveCode = {
    id: number | string;
    code: string;
    status: string;
    user?: User | null;
    type: string;
    created_at: string;
    assigned_at?: string | null;
};

type Batch = {
    id: number;
    name: string;
    prefix: string | null;
    count: number;
    created_at: string;
    creator: User;
    resolve_codes: ResolveCode[];
};

interface BatchDetailProps {
    batch: Batch;
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

export default function BatchDetail({ batch }: BatchDetailProps) {
    const [copiedCodes, setCopiedCodes] = useState<string[]>([]);
    const assignedCodes = batch.resolve_codes.filter((code) => code.status === 'assigned');
    const unassignedCodes = batch.resolve_codes.filter((code) => code.status === 'unassigned');

    const copyToClipboard = async (codes: string[], type: string) => {
        try {
            await navigator.clipboard.writeText(codes.join('\n'));
            setCopiedCodes(codes);
            setTimeout(() => setCopiedCodes([]), 2000);
        } catch (err) {
            console.error('Failed to copy codes: ', err);
        }
    };

    const copyAllCodes = () => {
        const allCodes = batch.resolve_codes.map((code) => code.code);
        copyToClipboard(allCodes, 'all');
    };

    const copyUnassignedCodes = () => {
        const codes = unassignedCodes.map((code) => code.code);
        copyToClipboard(codes, 'unassigned');
    };

    const copyAssignedCodes = () => {
        const codes = assignedCodes.map((code) => code.code);
        copyToClipboard(codes, 'assigned');
    };

    return (
        <AppLayout>
            <div className="mx-auto w-[90%] max-w-full p-6">
                <Breadcrumbs
                    breadcrumbs={[
                        { title: 'Dashboard', href: route('dashboard') },
                        { title: 'Resolve Codes', href: route('admin.resolve-codes.index') },
                        { title: 'Batches', href: route('admin.batches.index') },
                        { title: batch.name, href: route('admin.batches.show', batch.id) },
                    ]}
                />

                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">{batch.name}</h1>
                        <p className="text-sm text-gray-600">
                            Created by {batch.creator.name} on {formatDate(batch.created_at)}
                        </p>
                    </div>
                    <Link
                        href={route('admin.batches.index')}
                        className="inline-flex items-center gap-2 rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-gray-700"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Batches
                    </Link>
                </div>

                {/* Batch Stats */}
                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
                    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-500 text-white">
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
                                <p className="text-lg font-semibold text-gray-900">{batch.count}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-green-500 text-white">
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-500">Assigned</p>
                                <p className="text-lg font-semibold text-gray-900">{assignedCodes.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-yellow-500 text-white">
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-500">Unassigned</p>
                                <p className="text-lg font-semibold text-gray-900">{unassignedCodes.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-purple-500 text-white">
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                                        />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-500">Prefix</p>
                                <p className="text-lg font-semibold text-gray-900">{batch.prefix || 'None'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Copy Actions */}
                <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                    <h3 className="mb-3 text-lg font-semibold text-gray-900">Copy Codes</h3>
                    <div className="flex flex-wrap gap-3">
                        <Button onClick={copyAllCodes} variant="outline" size="sm" className="flex items-center gap-2 transition-colors">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                />
                            </svg>
                            Copy All Codes ({batch.count})
                        </Button>

                        {unassignedCodes.length > 0 && (
                            <Button
                                onClick={copyUnassignedCodes}
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2 border-yellow-200 text-yellow-700 hover:bg-yellow-50"
                            >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                    />
                                </svg>
                                Copy Unassigned ({unassignedCodes.length})
                            </Button>
                        )}

                        {assignedCodes.length > 0 && (
                            <Button
                                onClick={copyAssignedCodes}
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2 border-green-200 text-green-700 hover:bg-green-50"
                            >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                    />
                                </svg>
                                Copy Assigned ({assignedCodes.length})
                            </Button>
                        )}
                    </div>
                    {copiedCodes.length > 0 && <div className="mt-2 text-sm text-green-600">✓ Copied {copiedCodes.length} codes to clipboard!</div>}
                </div>

                <Separator className="my-6" />

                {/* Codes Table */}
                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                    <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
                        <h3 className="text-sm font-medium text-gray-900">Codes in This Batch</h3>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full bg-white text-left text-sm text-gray-500">
                            <thead className="border-b border-gray-200 bg-gray-50 text-xs text-gray-700 uppercase">
                                <tr>
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
                                        Created At
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Assigned At
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {batch.resolve_codes.map((code: ResolveCode) => (
                                    <tr key={code.id} className="bg-white transition-colors hover:bg-gray-50">
                                        <td className="px-6 py-4 font-mono font-medium text-gray-900">{code.code}</td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
                                                    code.status === 'assigned' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                }`}
                                            >
                                                {code.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">{code.user ? code.user.name : <span className="text-muted-foreground">-</span>}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-block rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                                                {code.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-gray-500">{formatDate(code.created_at)}</td>
                                        <td className="px-6 py-4 text-xs text-gray-500">
                                            {code.assigned_at ? formatDate(code.assigned_at) : <span className="text-muted-foreground">-</span>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

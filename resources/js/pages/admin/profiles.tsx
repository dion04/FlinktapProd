import { Breadcrumbs } from '@/components/breadcrumbs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useDebounce } from '@/hooks/useDebounce';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { format } from 'date-fns';
import { useEffect, useRef, useState } from 'react';
import { utils, writeFile } from 'xlsx';

// Import components
import { AnalyticsCards } from '@/components/admin/AnalyticsCards';
import { AnalyticsCharts } from '@/components/admin/AnalyticsCharts';
import { DatePickerModal } from '@/components/admin/DatePickerModal';
import DeleteConfirmationModal from '@/components/admin/DeleteConfirmationModal';
import { ProfileFilters } from '@/components/admin/ProfileFilters';
import ProfileTable from '@/components/admin/ProfileTable';
import { TopProfiles } from '@/components/admin/TopProfiles';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Dashboard',
        href: '/admin/dashboard',
    },
    {
        title: 'Profiles',
        href: '/admin/profiles',
    },
];

type Profile = {
    id: number;
    first_name: string;
    last_name: string;
    slug: string;
    bio: string | null;
    avatar_url: string | null;
    website_url: string | null;
    is_public: boolean;
    created_at: string;
    visit_count: number;
    unique_visitors: number;
    recent_visits: number;
    user: {
        id: number;
        name: string;
        email: string;
    };
    resolve_code?: {
        id: number;
        code: string;
    } | null;
};

type ProfilesProp = {
    data: Profile[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
};

interface AnalyticsData {
    profiles: {
        total: number;
        public: number;
        private: number;
        this_week: number;
        this_month: number;
        this_year: number;
        privacy_rate: number;
    };
    visits: {
        total: number;
        this_week: number;
        this_month: number;
        unique_this_month: number;
        avg_per_profile: number;
    };
    engagement: {
        profiles_with_visits: number;
        engagement_rate: number;
    };
    trends: {
        profile_creation: Array<{
            date: string;
            profiles: number;
            visits: number;
        }>;
        visits: Array<{
            date: string;
            visits: number;
            unique_visitors: number;
        }>;
    };
    top_profiles: Array<{
        id: number;
        first_name: string;
        last_name: string;
        slug: string;
        visits_count: number;
        unique_visitors: number;
    }>;
    geography: Array<{
        country: string;
        visits: number;
    }>;
    devices: Array<{
        device_type: string;
        visits: number;
    }>;
    social_platforms: Record<string, number>;
    recent: {
        profiles: Array<{
            id: number;
            display_name: string;
            slug: string;
            created_at: string;
            user: { name: string };
            resolve_code?: { code: string } | null;
        }>;
        visits: Array<{
            id: number;
            visited_at: string;
            country: string | null;
            profile: {
                display_name: string;
                slug: string;
            };
        }>;
    };
}

interface ProfilesIndexProps {
    profiles: ProfilesProp;
    analytics: AnalyticsData;
    filters: {
        search: string;
        status: string;
        sort_by: string;
        sort_order: string;
        date_from?: string;
        date_to?: string;
    };
}

import { formatDate } from '@/utils/format-utils';

export default function ProfilesIndex({ profiles, analytics, filters }: ProfilesIndexProps) {
    const [searchValue, setSearchValue] = useState(filters.search);
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [sortBy, setSortBy] = useState(filters.sort_by);
    const [sortOrder, setSortOrder] = useState(filters.sort_order);
    const [selected, setSelected] = useState<number[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [pendingDelete, setPendingDelete] = useState<number[]>([]);
    const [deleting, setDeleting] = useState(false);
    const [dateFrom, setDateFrom] = useState<Date | undefined>(filters.date_from ? new Date(filters.date_from) : undefined);
    const [dateTo, setDateTo] = useState<Date | undefined>(filters.date_to ? new Date(filters.date_to) : undefined);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [datePickerType, setDatePickerType] = useState<'from' | 'to'>('from');
    const cancelButtonRef = useRef<HTMLButtonElement>(null);
    const datePickerRef = useRef<HTMLDivElement>(null);

    // Debounced search function
    const debouncedSearch = useDebounce((searchTerm: string, status: string, sortBy: string, sortOrder: string, fromDate?: Date, toDate?: Date) => {
        const filterParams = {
            search: searchTerm,
            status: status === 'all' ? '' : status,
            sort_by: sortBy,
            sort_order: sortOrder,
            date_from: fromDate ? format(fromDate, 'yyyy-MM-dd') : '',
            date_to: toDate ? format(toDate, 'yyyy-MM-dd') : '',
        };

        router.get(route('admin.profiles.index'), filterParams, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    }, 300);
    const handleSearchChange = (value: string) => {
        setSearchValue(value);
        debouncedSearch(value, statusFilter, sortBy, sortOrder, dateFrom, dateTo);
    };

    const handleStatusFilterChange = (value: string) => {
        setStatusFilter(value);
        debouncedSearch(searchValue, value, sortBy, sortOrder, dateFrom, dateTo);
    };

    const handleSortChange = (newSortBy: string) => {
        const newSortOrder = sortBy === newSortBy && sortOrder === 'desc' ? 'asc' : 'desc';
        setSortBy(newSortBy);
        setSortOrder(newSortOrder);
        debouncedSearch(searchValue, statusFilter, newSortBy, newSortOrder, dateFrom, dateTo);
    };
    const handleDateChange = (date: Date | undefined, type: 'from' | 'to') => {
        if (type === 'from') {
            setDateFrom(date);
            // If the "to" date is before the "from" date, adjust the "to" date
            if (date && dateTo && date > dateTo) {
                setDateTo(date);
                debouncedSearch(searchValue, statusFilter, sortBy, sortOrder, date, date);
            } else {
                debouncedSearch(searchValue, statusFilter, sortBy, sortOrder, date, dateTo);
            }
        } else {
            setDateTo(date);
            // If the "from" date is after the "to" date, adjust the "from" date
            if (date && dateFrom && date < dateFrom) {
                setDateFrom(date);
                debouncedSearch(searchValue, statusFilter, sortBy, sortOrder, date, date);
            } else {
                debouncedSearch(searchValue, statusFilter, sortBy, sortOrder, dateFrom, date);
            }
        }
        setShowDatePicker(false);
    };

    const openDatePicker = (type: 'from' | 'to') => {
        setDatePickerType(type);
        setShowDatePicker(true);
    };

    const clearDateFilter = (type: 'from' | 'to') => {
        if (type === 'from') {
            setDateFrom(undefined);
            debouncedSearch(searchValue, statusFilter, sortBy, sortOrder, undefined, dateTo);
        } else {
            setDateTo(undefined);
            debouncedSearch(searchValue, statusFilter, sortBy, sortOrder, dateFrom, undefined);
        }
    };
    const exportToExcel = async () => {
        try {
            // Show loading indicator by changing button state
            const exportButton = document.getElementById('export-button') as HTMLButtonElement;
            if (exportButton) {
                exportButton.innerHTML =
                    '<svg class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Exporting...';
                exportButton.disabled = true;
            }

            // Get current filters
            const currentFilters = {
                search: searchValue,
                status: statusFilter === 'all' ? '' : statusFilter,
                date_from: dateFrom ? format(dateFrom, 'yyyy-MM-dd') : '',
                date_to: dateTo ? format(dateTo, 'yyyy-MM-dd') : '',
                export: 'true', // Signal to backend that we want all data for export
            };

            // Try to fetch all profiles with current filters for export
            try {
                const response = await fetch(route('admin.profiles.index', currentFilters), {
                    method: 'GET',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        Accept: 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.profiles && data.profiles.data && data.profiles.data.length > 0) {
                        // Use the data from the response
                        prepareAndDownloadExcel(data.profiles.data);
                    } else {
                        // Fallback to current page data
                        prepareAndDownloadExcel(profiles.data);
                    }
                } else {
                    // Fallback to current page data
                    prepareAndDownloadExcel(profiles.data);
                }
            } catch (error) {
                console.error('Error fetching export data:', error);
                // Fallback to current page data
                prepareAndDownloadExcel(profiles.data);
            }
        } catch (error) {
            console.error('Export error:', error);
            alert('Export failed. Please try again.');
        } finally {
            // Reset button state
            const exportButton = document.getElementById('export-button') as HTMLButtonElement;
            if (exportButton) {
                exportButton.innerHTML =
                    '<svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg> Export to Excel';
                exportButton.disabled = false;
            }
        }
    };

    const prepareAndDownloadExcel = (dataToProcess: Profile[]) => {
        // Prepare data for export with more details
        const dataToExport = dataToProcess.map((profile) => ({
            ID: profile.id,
            'Profile Name': `${profile.first_name} ${profile.last_name}`,
            Slug: profile.slug,
            Visibility: profile.is_public ? 'Public' : 'Private',
            Bio: profile.bio || '',
            Website: profile.website_url || '',
            'Avatar URL': profile.avatar_url || '',
            'User ID': profile.user.id,
            'User Name': profile.user.name,
            'User Email': profile.user.email,
            'Resolve Code': profile.resolve_code?.code || '',
            'Resolve Code ID': profile.resolve_code?.id || '',
            'Total Visits': profile.visit_count,
            'Unique Visitors': profile.unique_visitors,
            'Recent Visits': profile.recent_visits,
            'Created At': formatDate(profile.created_at),
            'Created Date': new Date(profile.created_at).toISOString().split('T')[0], // ISO date format
            'Created Time': new Date(profile.created_at).toISOString().split('T')[1].split('.')[0], // ISO time format
        }));

        // Create a new workbook and add the data
        const wb = utils.book_new();

        // Convert to worksheet with custom column widths
        const ws = utils.json_to_sheet(dataToExport);

        // Set column widths
        const columnWidths = [
            { wch: 8 }, // ID
            { wch: 25 }, // Profile Name
            { wch: 20 }, // Slug
            { wch: 12 }, // Visibility
            { wch: 30 }, // Bio
            { wch: 30 }, // Website
            { wch: 40 }, // Avatar URL
            { wch: 8 }, // User ID
            { wch: 25 }, // User Name
            { wch: 30 }, // User Email
            { wch: 20 }, // Resolve Code
            { wch: 15 }, // Resolve Code ID
            { wch: 12 }, // Total Visits
            { wch: 15 }, // Unique Visitors
            { wch: 15 }, // Recent Visits
            { wch: 25 }, // Created At
            { wch: 15 }, // Created Date
            { wch: 15 }, // Created Time
        ];
        ws['!cols'] = columnWidths;

        // Add the worksheet to the workbook
        utils.book_append_sheet(wb, ws, 'Profiles');

        // Add a summary sheet
        const summaryData = [
            { Metric: 'Total Profiles', Value: dataToProcess.length },
            { Metric: 'Public Profiles', Value: dataToProcess.filter((p) => p.is_public).length },
            { Metric: 'Private Profiles', Value: dataToProcess.filter((p) => !p.is_public).length },
            { Metric: 'Total Visits', Value: dataToProcess.reduce((sum, p) => sum + p.visit_count, 0) },
            {
                Metric: 'Average Visits Per Profile',
                Value: (dataToProcess.reduce((sum, p) => sum + p.visit_count, 0) / dataToProcess.length || 0).toFixed(2),
            },
            { Metric: 'Exported On', Value: new Date().toLocaleString() },
            { Metric: 'Filter - Search', Value: searchValue || 'None' },
            { Metric: 'Filter - Status', Value: statusFilter === 'all' ? 'All' : statusFilter },
            { Metric: 'Filter - Date From', Value: dateFrom ? format(dateFrom, 'PP') : 'None' },
            { Metric: 'Filter - Date To', Value: dateTo ? format(dateTo, 'PP') : 'None' },
        ];

        const summaryWs = utils.json_to_sheet(summaryData);
        summaryWs['!cols'] = [{ wch: 30 }, { wch: 30 }];
        utils.book_append_sheet(wb, summaryWs, 'Summary');

        // Generate a filename with current date and time
        const fileName = `profiles_export_${format(new Date(), 'yyyy-MM-dd_HH-mm-ss')}.xlsx`;

        // Write the file and trigger download
        writeFile(wb, fileName);
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelected(profiles.data.map((profile) => profile.id));
        } else {
            setSelected([]);
        }
    };

    const handleSelectItem = (id: number, checked: boolean) => {
        if (checked) {
            setSelected([...selected, id]);
        } else {
            setSelected(selected.filter((item) => item !== id));
        }
    };

    const confirmDelete = (ids: number[]) => {
        setPendingDelete(ids);
        setShowModal(true);
        setTimeout(() => cancelButtonRef.current?.focus(), 100);
    };
    const handleDeleteConfirmed = async () => {
        setShowModal(false);
        setDeleting(true);

        try {
            const url = route('admin.profiles.bulk-delete');
            console.log('Sending delete request to URL:', url);
            console.log('Delete payload:', JSON.stringify({ ids: pendingDelete }));

            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name=csrf-token]') as HTMLMetaElement)?.content || '',
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({ ids: pendingDelete }),
            });

            const responseData = await response.json().catch(() => null);
            console.log('Delete response status:', response.status);
            console.log('Delete response data:', responseData);

            if (!response.ok) {
                throw new Error(`Delete operation failed: ${responseData?.message || response.statusText}`);
            }

            router.reload();
        } catch (error) {
            console.error('Error deleting profiles:', error);
            alert(`Failed to delete profile(s): ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setDeleting(false);
            setSelected([]);
            setPendingDelete([]);
        }
    };
    const toggleVisibility = async (profileId: number) => {
        try {
            const url = route('admin.profiles.toggle-visibility', profileId);
            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name=csrf-token]') as HTMLMetaElement)?.content || '',
                },
            });

            if (!response.ok) {
                throw new Error('Toggle visibility operation failed');
            }

            // Use router to reload the page without a full page refresh
            router.reload();
        } catch (error) {
            console.error('Error toggling profile visibility:', error);
            // Optionally show an error toast notification here
        }
    }; // Handle clicking outside the date picker to close it
    useEffect(() => {
        if (!showDatePicker) return;

        function handleClickOutside(event: MouseEvent) {
            if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
                setShowDatePicker(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDatePicker]);
    return (
        <AppLayout>
            <Head title="Profile Management" />

            <div className="flex flex-col gap-8 p-8">
                <div>
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                    <div className="mt-4">
                        <h1 className="text-3xl font-bold">Profile Management</h1>
                        <p className="text-muted-foreground mt-2">Manage user profiles and view comprehensive analytics</p>
                    </div>
                </div>

                {/* Analytics Cards */}
                <AnalyticsCards analytics={analytics} />

                {/* Charts Section */}
                <AnalyticsCharts analytics={analytics} />

                {/* Top Profiles */}
                <TopProfiles topProfiles={analytics.top_profiles} />

                {/* Filters, Search, and Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Profile Management</CardTitle>
                        <CardDescription>Search, filter, and manage user profiles</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Filters and Search */}
                        <ProfileFilters
                            searchValue={searchValue}
                            statusFilter={statusFilter}
                            dateFrom={dateFrom}
                            dateTo={dateTo}
                            onSearchChange={handleSearchChange}
                            onStatusFilterChange={handleStatusFilterChange}
                            onExportToExcel={exportToExcel}
                            onOpenDatePicker={openDatePicker}
                            onClearDateFilter={clearDateFilter}
                            selected={selected}
                            onConfirmDelete={confirmDelete}
                            deleting={deleting}
                        />

                        <Separator className="my-4" />

                        {/* Table */}
                        <ProfileTable
                            profiles={profiles}
                            selected={selected}
                            onSelectItem={handleSelectItem}
                            onSelectAll={handleSelectAll}
                            onConfirmDelete={confirmDelete}
                            onSortChange={handleSortChange}
                            sortBy={sortBy}
                            sortOrder={sortOrder as 'asc' | 'desc'}
                            router={router}
                        />
                    </CardContent>
                </Card>
            </div>

            {/* Date Picker Modal */}
            {showDatePicker && (
                <DatePickerModal
                    datePickerRef={datePickerRef as React.RefObject<HTMLDivElement>}
                    datePickerType={datePickerType}
                    selectedDate={datePickerType === 'from' ? dateFrom : dateTo}
                    onDateSelect={(date) => {
                        if (datePickerType === 'from') {
                            setDateFrom(date);
                        } else {
                            setDateTo(date);
                        }
                    }}
                    onClose={() => setShowDatePicker(false)}
                    onApply={() => {
                        if (datePickerType === 'from') {
                            handleDateChange(dateFrom, 'from');
                        } else {
                            handleDateChange(dateTo, 'to');
                        }
                    }}
                />
            )}

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={showModal}
                itemCount={pendingDelete.length}
                isDeleting={deleting}
                onCancel={() => setShowModal(false)}
                onConfirm={handleDeleteConfirmed}
            />
        </AppLayout>
    );
}

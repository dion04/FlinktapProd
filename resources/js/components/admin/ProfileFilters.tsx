import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { Calendar, Download, Search, Trash2, X } from 'lucide-react';

type ProfileFiltersProps = {
    searchValue: string;
    statusFilter: string;
    dateFrom: Date | undefined;
    dateTo: Date | undefined;
    selected: number[];
    deleting: boolean;
    onSearchChange: (value: string) => void;
    onStatusFilterChange: (value: string) => void;
    onOpenDatePicker: (type: 'from' | 'to') => void;
    onClearDateFilter: (type: 'from' | 'to') => void;
    onExportToExcel: () => void;
    onConfirmDelete: (ids: number[]) => void;
};

export function ProfileFilters({
    searchValue,
    statusFilter,
    dateFrom,
    dateTo,
    selected,
    deleting,
    onSearchChange,
    onStatusFilterChange,
    onOpenDatePicker,
    onClearDateFilter,
    onExportToExcel,
    onConfirmDelete,
}: ProfileFiltersProps) {
    return (
        <div className="flex flex-wrap gap-4">
            <div className="relative w-full min-w-[250px] md:w-auto md:flex-1">
                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input placeholder="Search profiles..." value={searchValue} onChange={(e) => onSearchChange(e.target.value)} className="pl-10" />
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <Select value={statusFilter} onValueChange={onStatusFilterChange}>
                    <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Profiles</SelectItem>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                </Select>

                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Button
                            variant="outline"
                            onClick={() => onOpenDatePicker('from')}
                            className={`h-10 min-w-[135px] justify-start text-left font-normal transition-all duration-200 ${dateFrom ? 'w-[160px]' : 'w-[135px]'}`}
                        >
                            <Calendar className="mr-2 h-4 w-4 flex-shrink-0" />
                            {dateFrom ? (
                                <span className="truncate">{format(dateFrom, 'PP')}</span>
                            ) : (
                                <span className="text-muted-foreground">From date</span>
                            )}
                        </Button>
                        {dateFrom && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="absolute top-0 right-0 h-full rounded-l-none"
                                onClick={() => onClearDateFilter('from')}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                    <div className="relative">
                        <Button
                            variant="outline"
                            onClick={() => onOpenDatePicker('to')}
                            className={`h-10 min-w-[135px] justify-start text-left font-normal transition-all duration-200 ${dateTo ? 'w-[160px]' : 'w-[135px]'}`}
                        >
                            <Calendar className="mr-2 h-4 w-4 flex-shrink-0" />
                            {dateTo ? (
                                <span className="truncate">{format(dateTo, 'PP')}</span>
                            ) : (
                                <span className="text-muted-foreground">To date</span>
                            )}
                        </Button>
                        {dateTo && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="absolute top-0 right-0 h-full rounded-l-none"
                                onClick={() => onClearDateFilter('to')}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            <div className="ml-auto flex items-center gap-2">
                <Button id="export-button" variant="outline" className="flex items-center gap-2" onClick={onExportToExcel}>
                    <Download className="h-4 w-4" />
                    Export to Excel
                </Button>

                {selected.length > 0 && (
                    <Button
                        variant="destructive"
                        size="sm"
                        className="flex items-center gap-2"
                        disabled={deleting}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onConfirmDelete(selected);
                        }}
                    >
                        {deleting ? (
                            <>
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <Trash2 className="h-4 w-4" />
                                Delete Selected ({selected.length})
                            </>
                        )}
                    </Button>
                )}
            </div>
        </div>
    );
}

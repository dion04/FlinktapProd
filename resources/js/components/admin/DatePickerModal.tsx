import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { RefObject } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

type DatePickerModalProps = {
    datePickerRef: RefObject<HTMLDivElement>;
    datePickerType: 'from' | 'to';
    selectedDate: Date | undefined;
    onDateSelect: (date: Date | undefined) => void;
    onClose: () => void;
    onApply: () => void;
};

export function DatePickerModal({ datePickerRef, datePickerType, selectedDate, onDateSelect, onClose, onApply }: DatePickerModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop overlay */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" onClick={onClose} />

            {/* Date picker modal */}
            <div
                ref={datePickerRef}
                className="bg-card relative z-10 rounded-lg border p-4 shadow-xl"
                style={{
                    maxWidth: '90vw',
                    width: '400px',
                }}
            >
                <div className="mb-4 flex items-center justify-between border-b pb-2">
                    <h3 className="text-lg font-medium">{datePickerType === 'from' ? 'Select Start Date' : 'Select End Date'}</h3>
                    <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <div className="flex justify-center">
                    <DayPicker
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => {
                            onDateSelect(date);
                        }}
                        className="border-none"
                        defaultMonth={selectedDate || new Date()}
                        showOutsideDays
                        fixedWeeks
                        modifiersStyles={{
                            selected: {
                                backgroundColor: '#3b82f6',
                                color: 'white',
                            },
                            today: {
                                fontWeight: 'bold',
                                border: '2px solid currentColor',
                            },
                        }}
                        styles={{
                            caption: {
                                fontSize: '1.1rem',
                                marginBottom: '0.5rem',
                                fontWeight: '500',
                            },
                            day: {
                                margin: '0.15rem',
                                borderRadius: '0.375rem',
                                transition: 'all 0.15s ease',
                            },
                            head_cell: {
                                fontWeight: '500',
                                color: 'var(--muted-foreground)',
                            },
                            button_reset: {
                                transition: 'background-color 0.15s ease, color 0.15s ease',
                            },
                        }}
                        footer={
                            <div className="text-muted-foreground mt-2 pt-2 text-center text-sm">
                                <button
                                    className="text-primary underline hover:no-underline"
                                    onClick={() => {
                                        const today = new Date();
                                        onDateSelect(today);
                                    }}
                                >
                                    Go to today
                                </button>
                            </div>
                        }
                    />
                </div>
                <div className="mt-4 flex justify-end gap-2 border-t pt-4">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={onApply}>Apply</Button>
                </div>
            </div>
        </div>
    );
}

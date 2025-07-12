import { Button } from '@/components/ui/button';
import { useRef } from 'react';

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    itemCount: number;
    isDeleting: boolean;
    onCancel: () => void;
    onConfirm: () => void;
}

export default function DeleteConfirmationModal({ isOpen, itemCount, isDeleting, onCancel, onConfirm }: DeleteConfirmationModalProps) {
    const cancelButtonRef = useRef<HTMLButtonElement>(null);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="max-w-[90vw] min-w-[320px] rounded-lg bg-white p-6 shadow-lg">
                <h2 className="mb-2 text-lg font-semibold">Confirm Delete</h2>
                <p className="text-muted-foreground mb-4 text-sm">
                    Are you sure you want to delete {itemCount} profile{itemCount > 1 ? 's' : ''}? This action cannot be undone and will also delete
                    all associated data.
                </p>
                <div className="flex justify-end gap-2">
                    <Button type="button" variant="secondary" size="sm" ref={cancelButtonRef} onClick={onCancel} disabled={isDeleting}>
                        Cancel
                    </Button>
                    <Button type="button" variant="destructive" size="sm" onClick={onConfirm} disabled={isDeleting}>
                        {isDeleting ? (
                            <>
                                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                Deleting...
                            </>
                        ) : (
                            `Delete ${itemCount > 1 ? 'Profiles' : 'Profile'}`
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}

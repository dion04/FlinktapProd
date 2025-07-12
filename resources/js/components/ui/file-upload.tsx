import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Upload, X, Image } from 'lucide-react';
import { Button } from './button';
import { Label } from './label';
import { cn } from '@/lib/utils';

interface FileUploadProps {
    id: string;
    label: string;
    accept?: string;
    preview?: string | null;
    onFileSelect: (file: File | null) => void;
    onPreviewRemove?: () => void;
    className?: string;
    disabled?: boolean;
    maxSize?: number; // in MB
    aspectRatio?: 'square' | 'banner' | 'auto';
    overlay?: boolean; // New prop for overlay mode
}

export function FileUpload({
    id,
    label,
    accept = 'image/*',
    preview,
    onFileSelect,
    onPreviewRemove,
    className,
    disabled = false,
    maxSize = 5,
    aspectRatio = 'auto',
    overlay = false
}: FileUploadProps) {
    const [isDragOver, setIsDragOver] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const validateFile = (file: File): boolean => {
        setError(null);

        // Check file size
        if (file.size > maxSize * 1024 * 1024) {
            setError(`File size must be less than ${maxSize}MB`);
            return false;
        }

        // Check file type
        if (!file.type.startsWith('image/')) {
            setError('Please select an image file');
            return false;
        }

        return true;
    };

    const handleFileSelect = (file: File) => {
        if (validateFile(file)) {
            onFileSelect(file);
        }
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (!disabled) {
            setIsDragOver(true);
        }
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(false);

        if (disabled) return;

        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            handleFileSelect(files[0]);
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFileSelect(files[0]);
        }
    };

    const handleRemove = () => {
        onFileSelect(null);
        onPreviewRemove?.();
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const getAspectRatioClasses = () => {
        switch (aspectRatio) {
            case 'square':
                return 'aspect-square';
            case 'banner':
                return 'aspect-[3/1]';
            default:
                return 'min-h-32';
        }
    };    return (
        <>
            {overlay ? (
                // Overlay mode - invisible clickable area only
                <div
                    className={cn(
                        'absolute inset-0 cursor-pointer transition-all duration-200',
                        disabled && 'opacity-50 cursor-not-allowed',
                        className
                    )}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => !disabled && fileInputRef.current?.click()}
                />
            ) : (
                // Standard mode
                <div className={cn('space-y-2', className)}>
                    {label && <Label htmlFor={id}>{label}</Label>}
                    
                    {preview ? (
                        <div className={cn('relative overflow-hidden rounded-lg border-2 border-gray-200', getAspectRatioClasses())}>
                            <img
                                src={preview}
                                alt="Preview"
                                className="h-full w-full object-cover"
                            />
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 h-8 w-8"
                                onClick={handleRemove}
                                disabled={disabled}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                        <div
                            className={cn(
                                'border-2 border-dashed rounded-lg transition-colors cursor-pointer',
                                getAspectRatioClasses(),
                                isDragOver
                                    ? 'border-blue-400 bg-blue-50'
                                    : 'border-gray-300 hover:border-gray-400',
                                disabled && 'opacity-50 cursor-not-allowed',
                                'flex flex-col items-center justify-center gap-2 p-6'
                            )}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => !disabled && fileInputRef.current?.click()}
                        >
                            <Image className="h-8 w-8 text-gray-400" />
                            <div className="text-center">
                                <p className="text-sm font-medium text-gray-900">
                                    Drop an image here, or{' '}
                                    <span className="text-blue-600">browse</span>
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    PNG, JPG, GIF up to {maxSize}MB
                                </p>
                            </div>
                            <Upload className="h-4 w-4 text-gray-400" />
                        </div>
                    )}
                </div>
            )}

            <input
                ref={fileInputRef}
                id={id}
                type="file"
                accept={accept}
                onChange={handleInputChange}
                className="hidden"
                disabled={disabled}
            />

            {error && !overlay && (
                <p className="text-sm text-red-600">{error}</p>
            )}
        </>
    );
}

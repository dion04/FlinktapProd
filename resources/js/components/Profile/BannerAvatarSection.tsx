import { FileUpload } from '@/components/ui/file-upload';
import { Trash2 } from 'lucide-react';

interface BannerAvatarSectionProps {
    bannerPreview: string | null;
    avatarPreview: string | null;
    handleBannerSelect: (file: File | null) => void;
    handleBannerRemove: () => void;
    handleAvatarSelect: (file: File | null) => void;
    handleAvatarRemove: () => void;
    isUploading: boolean;
}

export default function BannerAvatarSection({
    bannerPreview,
    avatarPreview,
    handleBannerSelect,
    handleBannerRemove,
    handleAvatarSelect,
    handleAvatarRemove,
    isUploading,
}: BannerAvatarSectionProps) {
    return (
        <div className="relative mb-6">
            <div className="group relative h-32 w-full cursor-pointer overflow-hidden bg-gray-400 sm:h-40">
                {bannerPreview ? (
                    <img
                        src={bannerPreview}
                        alt="Banner preview"
                        className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center">
                        <span className="text-sm text-white/70">Click to add banner</span>
                    </div>
                )}

                {/* Hover overlay with visual feedback and file upload */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-all duration-200 group-hover:opacity-100">
                    <FileUpload
                        id="banner"
                        label=""
                        preview={bannerPreview}
                        onFileSelect={handleBannerSelect}
                        onPreviewRemove={handleBannerRemove}
                        aspectRatio="banner"
                        maxSize={5}
                        disabled={isUploading}
                        overlay={true}
                    />
                    <div className="pointer-events-none text-center text-white">
                        <div className="text-lg font-medium">{bannerPreview ? 'Change Banner' : 'Upload Banner'}</div>
                        <div className="text-sm opacity-75">Click anywhere or drag & drop</div>
                    </div>
                </div>

                {bannerPreview && (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleBannerRemove();
                        }}
                        className="absolute top-2 right-2 z-20 rounded-full bg-red-500 p-2 text-white opacity-0 shadow-lg transition-all duration-200 group-hover:opacity-100 hover:scale-110 hover:bg-red-600"
                        title="Remove banner"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                )}
            </div>
            <div className="absolute -bottom-12 left-1/2 z-10 -translate-x-1/2 transform">
                <div className="group relative">
                    <div className="h-32 w-32 cursor-pointer overflow-hidden rounded-lg border-4 border-white bg-gray-100 shadow-lg transition-all duration-200 group-hover:shadow-xl sm:h-36 sm:w-36">
                        {avatarPreview ? (
                            <img src={avatarPreview} alt="Avatar preview" className="h-full w-full object-cover" />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gray-200">
                                <span className="text-center text-xs text-gray-500">Click to add avatar</span>
                            </div>
                        )}
                    </div>

                    {/* Hover overlay with visual feedback and file upload */}
                    <div className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-lg bg-black/40 opacity-0 transition-all duration-200 group-hover:opacity-100">
                        <FileUpload
                            id="avatar"
                            label=""
                            preview={avatarPreview}
                            onFileSelect={handleAvatarSelect}
                            onPreviewRemove={handleAvatarRemove}
                            aspectRatio="square"
                            maxSize={5}
                            disabled={isUploading}
                            overlay={true}
                        />
                        <div className="pointer-events-none text-center text-white">
                            <div className="text-sm font-medium">{avatarPreview ? 'Change' : 'Upload'}</div>
                            <div className="text-xs opacity-75">Avatar</div>
                        </div>
                    </div>

                    {avatarPreview && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleAvatarRemove();
                            }}
                            className="absolute -top-2 -right-2 z-20 rounded-full bg-red-500 p-1 text-white opacity-0 shadow-lg transition-all duration-200 group-hover:opacity-100 hover:scale-110 hover:bg-red-600"
                            title="Remove avatar"
                        >
                            <Trash2 className="h-3 w-3" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

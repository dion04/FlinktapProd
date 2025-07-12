import BannerAvatarSection from '@/components/Profile/BannerAvatarSection';
import BasicInfoSection from '@/components/Profile/BasicInfoSection';
import CustomLinksSection from '@/components/Profile/CustomLinksSection';
import PrivacySettingsSection from '@/components/Profile/PrivacySettingsSection';
import ProfilePreview from '@/components/Profile/ProfilePreview';
import ServicesSection from '@/components/Profile/ServicesSection';
import SocialLinksSection from '@/components/Profile/SocialLinksSection';
import ThemeSettingsSection from '@/components/Profile/ThemeSettingsSection';
import { Button } from '@/components/ui/button';
import { CardContentCustom, CardCustom } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Head, router, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface CustomLink {
    [key: string]: string;
    name: string;
    url: string;
}

interface Service {
    [key: string]: string | boolean | undefined;
    id: string;
    name: string;
    isCustom?: boolean;
}

interface ProfileCreationProps {
    code?: string;
    resolveCode?: {
        id: number;
        code: string;
        type: string;
    };
}

export default function ProfileCreation({ code, resolveCode }: ProfileCreationProps) {
    const [customLinks, setCustomLinks] = useState<CustomLink[]>([]);
    const [selectedServices, setSelectedServices] = useState<Service[]>([]);
    const [customServices, setCustomServices] = useState<Service[]>([]);
    const [newCustomService, setNewCustomService] = useState('');
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [bannerPreview, setBannerPreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    // Predefined services
    const predefinedServices: Service[] = [
        { id: 'web-dev', name: 'Web Development' },
        { id: 'ui-ux', name: 'UI/UX Design' },
        { id: 'mobile-dev', name: 'Mobile App Development' },
        { id: 'graphic-design', name: 'Graphic Design' },
        { id: 'marketing', name: 'Digital Marketing' },
        { id: 'seo', name: 'SEO Optimization' },
        { id: 'content', name: 'Content Creation' },
        { id: 'photography', name: 'Photography' },
        { id: 'videography', name: 'Videography' },
        { id: 'consulting', name: 'Business Consulting' },
    ];
    const { data, setData, post, processing, errors } = useForm({
        resolve_code: code || '',
        first_name: '',
        last_name: '',
        bio: '',
        company_name: '',
        position: '',
        avatar_url: '',
        banner_url: '',
        website_url: '',
        twitter_username: '',
        instagram_username: '',
        linkedin_username: '',
        github_username: '',
        facebook_username: '',
        youtube_url: '',
        tiktok_username: '',
        discord_username: '',
        twitch_username: '',
        phone_number: '',
        email: '',
        location: '',
        custom_links: [] as CustomLink[],
        services: [] as Service[],
        is_public: true as boolean,
        theme: 'light' as string,
    });

    const addCustomLink = () => {
        const newLinks = [...customLinks, { name: '', url: '' }];
        setCustomLinks(newLinks);
        setData('custom_links', newLinks);
    };

    const removeCustomLink = (index: number) => {
        const newLinks = customLinks.filter((_, i) => i !== index);
        setCustomLinks(newLinks);
        setData('custom_links', newLinks);
    };

    const updateCustomLink = (index: number, field: 'name' | 'url', value: string) => {
        const newLinks = [...customLinks];
        newLinks[index][field] = value;
        setCustomLinks(newLinks);
        setData('custom_links', newLinks);
    };

    // Service selection functions
    const toggleService = (service: Service) => {
        // Check if the service is already selected
        const isSelected = selectedServices.some((s) => s.id === service.id);

        // Create a new services array based on selection state
        let updatedServices;
        if (isSelected) {
            // If selected, remove it
            updatedServices = selectedServices.filter((s) => s.id !== service.id);
        } else {
            // If not selected, add it
            updatedServices = [...selectedServices, { ...service, isCustom: false }];
        }

        // Update state with the new array in a controlled way
        setSelectedServices(updatedServices);

        // Update the form data with the combined services
        setData('services', [...updatedServices, ...customServices]);
    };

    const addCustomService = () => {
        if (!newCustomService.trim()) return;

        const customService: Service = {
            id: `custom-${Date.now()}`,
            name: newCustomService.trim(),
            isCustom: true,
        };

        const updatedCustomServices = [...customServices, customService];
        setCustomServices(updatedCustomServices);

        // Update the form data with the combined services
        setData('services', [...selectedServices, ...updatedCustomServices]);

        setNewCustomService('');
    };

    const removeCustomService = (serviceId: string) => {
        const updatedCustomServices = customServices.filter((s) => s.id !== serviceId);
        setCustomServices(updatedCustomServices);

        // Update the form data with the combined services
        setData('services', [...selectedServices, ...updatedCustomServices]);
    };

    const uploadImage = async (file: File, type: 'avatar' | 'banner'): Promise<string | null> => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);

        try {
            const response = await fetch(route('upload.image'), {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            // Check if response is OK first
            if (!response.ok) {
                console.error('Upload request failed:', response.status, response.statusText); // Show user-friendly error based on status code
                if (response.status === 401) {
                    alert('Authentication required. Please log in and try again.');
                } else if (response.status === 422) {
                    alert('Invalid file. Please ensure the image is under 5MB and in a supported format.');
                } else {
                    alert(`Upload failed: ${response.status} ${response.statusText}`);
                }
                return null;
            }

            // Check if response is JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                console.error('Upload response is not JSON:', contentType);
                const text = await response.text();
                console.error('Response text:', text.substring(0, 200));
                alert('Upload failed: Server returned invalid response');
                return null;
            }

            const result = await response.json();

            if (result.success) {
                return result.url;
            } else {
                console.error('Upload failed:', result.message);
                alert(`Upload failed: ${result.message}`);
                return null;
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Upload failed: Network error. Please try again.');
            return null;
        }
    };

    // Keep data.services in sync with local state
    useEffect(() => {
        // Only update if at least one of these arrays has elements
        if (selectedServices.length > 0 || customServices.length > 0) {
            const allServices = [...selectedServices, ...customServices];
            setData('services', allServices);
        }
    }, [selectedServices, customServices]); // Don't include setData in the dependencies to avoid extra renders

    const handleAvatarSelect = (file: File | null) => {
        setAvatarFile(file);
        if (file) {
            const url = URL.createObjectURL(file);
            setAvatarPreview(url);
        } else {
            setAvatarPreview(null);
            setData('avatar_url', '');
        }
    };

    const handleBannerSelect = (file: File | null) => {
        setBannerFile(file);
        if (file) {
            const url = URL.createObjectURL(file);
            setBannerPreview(url);
        } else {
            setBannerPreview(null);
            setData('banner_url', '');
        }
    };

    const handleAvatarRemove = () => {
        if (avatarPreview) {
            URL.revokeObjectURL(avatarPreview);
        }
        setAvatarFile(null);
        setAvatarPreview(null);
        setData('avatar_url', '');
    };

    const handleBannerRemove = () => {
        if (bannerPreview) {
            URL.revokeObjectURL(bannerPreview);
        }
        setBannerFile(null);
        setBannerPreview(null);
        setData('banner_url', '');
    };

    // Cleanup blob URLs on unmount
    useEffect(() => {
        return () => {
            if (avatarPreview) {
                URL.revokeObjectURL(avatarPreview);
            }
            if (bannerPreview) {
                URL.revokeObjectURL(bannerPreview);
            }
        };
    }, [avatarPreview, bannerPreview]);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUploading(true);

        try {
            const formData = { ...data };

            // Upload avatar if selected
            if (avatarFile) {
                const avatarUrl = await uploadImage(avatarFile, 'avatar');
                if (avatarUrl) {
                    formData.avatar_url = avatarUrl;
                }
            }

            // Upload banner if selected
            if (bannerFile) {
                const bannerUrl = await uploadImage(bannerFile, 'banner');
                if (bannerUrl) {
                    formData.banner_url = bannerUrl;
                }
            }

            setIsUploading(false);

            // Submit with updated data using router
            router.post(route('profile.store'), formData);
        } catch (error) {
            console.error('Error during upload:', error);
            setIsUploading(false);
        }
    };

    return (
        <>
            <Head title="Create Your Profile" />
            <div className="min-h-screen w-full bg-gray-50 px-0 py-0 sm:w-auto sm:px-6 sm:py-12 lg:px-8">
                <div className="mx-auto max-w-2xl">
                    <CardCustom>
                        <CardContentCustom>
                            <form onSubmit={submit}>
                                <input type="hidden" value={data.resolve_code} />
                                {/* Basic Information */} {/* Profile Header Section */}
                                {/* Banner and Avatar Layout */}
                                <BannerAvatarSection
                                    bannerPreview={bannerPreview}
                                    avatarPreview={avatarPreview}
                                    handleBannerSelect={handleBannerSelect}
                                    handleBannerRemove={handleBannerRemove}
                                    handleAvatarSelect={handleAvatarSelect}
                                    handleAvatarRemove={handleAvatarRemove}
                                    isUploading={isUploading}
                                />
                                {/* Basic Information */}
                                <BasicInfoSection data={data} setData={setData} errors={errors} />
                                <Separator />
                                {/* Social Links */}
                                <SocialLinksSection data={data} setData={setData} errors={errors} />
                                <Separator />
                                {/* Services */}
                                <ServicesSection
                                    predefinedServices={predefinedServices}
                                    selectedServices={selectedServices}
                                    customServices={customServices}
                                    toggleService={toggleService}
                                    addCustomService={addCustomService}
                                    removeCustomService={removeCustomService}
                                    newCustomService={newCustomService}
                                    setNewCustomService={setNewCustomService}
                                />
                                <Separator />
                                {/* Custom Links */}
                                <CustomLinksSection
                                    customLinks={customLinks}
                                    addCustomLink={addCustomLink}
                                    removeCustomLink={removeCustomLink}
                                    updateCustomLink={updateCustomLink}
                                />
                                <Separator />
                                {/* Privacy Settings */}
                                <PrivacySettingsSection isPublic={data.is_public} setData={setData} />
                                <Separator />
                                {/* Theme Settings */}
                                <ThemeSettingsSection data={data} setData={setData} />
                                <div className="flex items-center justify-between p-6">
                                    <ProfilePreview
                                        data={data}
                                        avatarPreview={avatarPreview}
                                        bannerPreview={bannerPreview}
                                        customLinks={customLinks}
                                        selectedServices={selectedServices}
                                        customServices={customServices}
                                    />
                                    <Button type="submit" disabled={processing || isUploading} className="px-8">
                                        {isUploading ? 'Uploading images...' : processing ? 'Creating...' : 'Create Profile'}
                                    </Button>
                                </div>
                            </form>
                        </CardContentCustom>
                    </CardCustom>
                </div>
            </div>
        </>
    );
}

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
import { Head, Link, router, useForm } from '@inertiajs/react';
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

interface Profile {
    resolve_code?: string;
    slug?: string;
    display_name?: string;
    first_name?: string;
    last_name?: string;
    bio?: string;
    company_name?: string;
    position?: string;
    avatar_url?: string;
    banner_url?: string;
    website_url?: string;
    twitter_username?: string;
    instagram_username?: string;
    linkedin_username?: string;
    github_username?: string;
    facebook_username?: string;
    youtube_url?: string;
    tiktok_username?: string;
    discord_username?: string;
    twitch_username?: string;
    phone_number?: string;
    email?: string;
    location?: string;
    custom_links?: CustomLink[];
    services?: Service[];
    is_public: boolean;
    theme?: string;
}

interface ProfileEditProps {
    profile: Profile;
}

export default function ProfileEdit({ profile }: ProfileEditProps) {
    const [customLinks, setCustomLinks] = useState<CustomLink[]>(profile.custom_links || []);
    const [newCustomService, setNewCustomService] = useState('');
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(profile.avatar_url || null);
    const [bannerPreview, setBannerPreview] = useState<string | null>(profile.banner_url || null);
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

    // Initialize selectedServices with only predefined services that exist in profile.services
    const [selectedServices, setSelectedServices] = useState<Service[]>(
        (profile.services || [])
            .filter((s) => !s.isCustom && predefinedServices.some((ps) => ps.id === s.id))
            .map((s) => {
                // Use the predefined service details for consistency
                const predefined = predefinedServices.find((ps) => ps.id === s.id);
                return predefined || s;
            }),
    ); // Initialize customServices with only custom services from profile.services
    const [customServices, setCustomServices] = useState<Service[]>(
        // Make sure we catch any service with isCustom or a custom ID
        (profile.services || [])
            .filter((s) => {
                // Consider a service custom if it has the isCustom flag OR if its ID starts with 'custom-'
                return s.isCustom === true || (typeof s.id === 'string' && s.id.startsWith('custom-'));
            })
            .map((s) => {
                // Always ensure the isCustom flag is set for these services
                return { ...s, isCustom: true };
            }),
    );

    // Initialize form data with the combined services
    const initialServices = [
        ...(profile.services || [])
            .filter((s) => !s.isCustom && predefinedServices.some((ps) => ps.id === s.id))
            .map((s) => {
                const predefined = predefinedServices.find((ps) => ps.id === s.id);
                return predefined || s;
            }),
        ...(profile.services || []).filter((s) => s.isCustom === true),
    ];

    const { data, setData, put, processing, errors } = useForm({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        bio: profile.bio || '',
        avatar_url: profile.avatar_url || '',
        banner_url: profile.banner_url || '',
        website_url: profile.website_url || '',
        twitter_username: profile.twitter_username || '',
        instagram_username: profile.instagram_username || '',
        linkedin_username: profile.linkedin_username || '',
        github_username: profile.github_username || '',
        facebook_username: profile.facebook_username || '',
        youtube_url: profile.youtube_url || '',
        tiktok_username: profile.tiktok_username || '',
        discord_username: profile.discord_username || '',
        twitch_username: profile.twitch_username || '',
        phone_number: profile.phone_number || '',
        custom_links: profile.custom_links || [],
        services: initialServices,
        is_public: profile.is_public,
        theme: profile.theme || 'light',
        email: profile.email || '',
        location: profile.location || '',
        position: profile.position || '',
        company_name: profile.company_name || '',
    });

    // Keep data.services in sync with local state
    useEffect(() => {
        // Only update if at least one of these arrays has elements
        if (selectedServices.length > 0 || customServices.length > 0) {
            // Ensure custom services have isCustom: true
            const allServices = [...selectedServices, ...customServices.map((service) => ({ ...service, isCustom: true }))];

            // Use functional update to ensure we're not creating unnecessary updates
            // when the arrays reference changes but content is the same
            setData((prevData) => {
                // Check if services have actually changed to prevent unnecessary updates
                const prevServices = prevData.services || [];
                if (allServices.length !== prevServices.length || JSON.stringify(allServices) !== JSON.stringify(prevServices)) {
                    return { ...prevData, services: allServices };
                }
                return prevData;
            });
        }
    }, [selectedServices, customServices]); // Don't include setData in the dependencies to avoid extra renders

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

        // Only update if there's an actual change to prevent unnecessary renders
        if (JSON.stringify(updatedServices) !== JSON.stringify(selectedServices)) {
            setSelectedServices(updatedServices);
        }
    };
    const addCustomService = () => {
        if (!newCustomService.trim()) return;

        // Create a new custom service with a unique ID and explicit isCustom flag
        const customService: Service = {
            id: `custom-${Date.now()}`,
            name: newCustomService.trim(),
            isCustom: true,
        };

        // Update the custom services state
        const updatedCustomServices = [...customServices, customService];
        setCustomServices(updatedCustomServices);

        // Clear the input field
        setNewCustomService('');
    };
    const removeCustomService = (serviceId: string) => {
        // Filter out the service with the given ID
        const updatedCustomServices = customServices.filter((s) => s.id !== serviceId);
        setCustomServices(updatedCustomServices);
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
                console.error('Upload request failed:', response.status, response.statusText);

                // Show user-friendly error based on status code
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

    const handleAvatarSelect = (file: File | null) => {
        setAvatarFile(file);
        if (file) {
            const url = URL.createObjectURL(file);
            setAvatarPreview(url);
        } else {
            setAvatarPreview(profile.avatar_url || null);
            setData('avatar_url', profile.avatar_url || '');
        }
    };

    const handleBannerSelect = (file: File | null) => {
        setBannerFile(file);
        if (file) {
            const url = URL.createObjectURL(file);
            setBannerPreview(url);
        } else {
            setBannerPreview(profile.banner_url || null);
            setData('banner_url', profile.banner_url || '');
        }
    };

    const handleAvatarRemove = () => {
        if (avatarPreview && avatarPreview !== profile.avatar_url) {
            URL.revokeObjectURL(avatarPreview);
        }
        setAvatarFile(null);
        setAvatarPreview(null);
        setData('avatar_url', '');
    };

    const handleBannerRemove = () => {
        if (bannerPreview && bannerPreview !== profile.banner_url) {
            URL.revokeObjectURL(bannerPreview);
        }
        setBannerFile(null);
        setBannerPreview(null);
        setData('banner_url', '');
    };

    // Cleanup blob URLs on unmount
    useEffect(() => {
        return () => {
            if (avatarPreview && avatarPreview !== profile.avatar_url) {
                URL.revokeObjectURL(avatarPreview);
            }
            if (bannerPreview && bannerPreview !== profile.banner_url) {
                URL.revokeObjectURL(bannerPreview);
            }
        };
    }, [avatarPreview, bannerPreview, profile.avatar_url, profile.banner_url]);
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
            } // Make sure the services data reflects the current state
            // Ensure isCustom is set correctly for all custom services
            const services = [...selectedServices, ...customServices.map((service) => ({ ...service, isCustom: true }))];

            // Log the services before submission to verify
            console.log('Submitting services:', services);
            console.log('Custom services:', customServices);

            formData.services = services;

            setIsUploading(false);

            // Submit with updated data using router
            router.put(route('profile.update', profile.slug), formData);
        } catch (error) {
            console.error('Error during upload:', error);
            setIsUploading(false);
        }
    };

    return (
        <>
            <Head title="Edit Profile" />

            <div className="min-h-screen w-full bg-gray-50 px-0 py-0 sm:w-auto sm:px-6 sm:py-12 lg:px-8">
                <div className="mx-auto max-w-2xl">
                    <CardCustom>
                        <CardContentCustom>
                            <form onSubmit={submit}>
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
                                <div className="flex flex-col items-center justify-between gap-2 px-2 py-2 pb-4">
                                    <ProfilePreview
                                        data={data}
                                        avatarPreview={avatarPreview}
                                        bannerPreview={bannerPreview}
                                        customLinks={customLinks}
                                        selectedServices={selectedServices}
                                        customServices={customServices}
                                    />
                                    <div className="flex gap-2">
                                        <Link href={route('profile.show', profile.slug)}>
                                            <Button type="button" variant="outline">
                                                Cancel
                                            </Button>
                                        </Link>
                                        <Button type="submit" disabled={processing || isUploading} className="px-8">
                                            {isUploading ? 'Uploading images...' : processing ? 'Saving...' : 'Save Changes'}
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </CardContentCustom>
                    </CardCustom>
                </div>
            </div>
        </>
    );
}

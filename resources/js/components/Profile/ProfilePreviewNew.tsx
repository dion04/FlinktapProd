import AppLogoIcon from '@/components/app-logo-icon';
import AppLogoIconWhite from '@/components/app-logo-icon-white';
import BannerSection from '@/components/Profile/BannerSection';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { getThemeConfig } from '@/lib/themes';
import {
    faDiscord,
    faGithub,
    faInstagram,
    faLinkedin,
    faSquareFacebook,
    faSquareXTwitter,
    faTiktok,
    faTwitch,
    faYoutube,
} from '@fortawesome/free-brands-svg-icons';
import { faExternalLinkAlt, faGlobe, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CircleUserRound, Eye, LayoutDashboard, Mail, MessageCircle, Phone, X } from 'lucide-react';
import { useState } from 'react';

interface CustomLink {
    name: string;
    url: string;
}

interface Service {
    id: string;
    name: string;
    isCustom?: boolean;
}

interface PreviewData {
    first_name: string;
    last_name: string;
    bio?: string;
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
    company_name?: string;
    position?: string;
    custom_links?: CustomLink[];
    services?: Service[];
    is_public: boolean;
    theme: string;
}

interface ProfilePreviewProps {
    data: PreviewData;
    avatarPreview?: string | null;
    bannerPreview?: string | null;
    customLinks?: CustomLink[];
    selectedServices?: Service[];
    customServices?: Service[];
}

export default function ProfilePreview({
    data,
    avatarPreview,
    bannerPreview,
    customLinks = [],
    selectedServices = [],
    customServices = [],
}: ProfilePreviewProps) {
    const [isServicesExpanded, setIsServicesExpanded] = useState(false);

    // Get theme configuration
    const themeConfig = getThemeConfig(data.theme || 'light');

    // Combine all services for preview
    const allServices = [...selectedServices.map((s) => ({ ...s, isCustom: false })), ...customServices.map((s) => ({ ...s, isCustom: true }))];

    // Use only the customLinks prop from form state, not the data.custom_links to avoid duplication
    const allCustomLinks = customLinks.filter((link) => link.name && link.url);

    const previewProfile = {
        ...data,
        avatar_url: avatarPreview || data.avatar_url,
        banner_url: bannerPreview || data.banner_url,
        services: allServices,
        custom_links: allCustomLinks,
    };

    const getSocialIcon = (platform: string) => {
        // Define theme-based colors for icons without backgrounds
        const getIconColor = (platform: string) => {
            switch (themeConfig.id) {
                case 'dark':
                    return {
                        twitter: 'text-gray-100',
                        linkedin: 'text-blue-400',
                        facebook: 'text-blue-400 ',
                    };
                case 'dark-minimal':
                    return {
                        twitter: 'text-white',
                        linkedin: 'text-white',
                        facebook: 'text-white',
                    };
                case 'light-minimal':
                    return {
                        twitter: 'text-black',
                        linkedin: 'text-black',
                        facebook: 'text-black',
                    };
                default: // light theme
                    return {
                        twitter: 'text-black',
                        linkedin: 'text-[#2C8BD4]',
                        facebook: 'text-[#0759C4]',
                    };
            }
        };

        // Define theme-based background colors for containerized icons
        const getBackgroundColors = () => {
            switch (themeConfig.id) {
                case 'dark':
                    return {
                        instagram: 'bg-[#AC07C4]',
                        github: 'bg-[#333]',
                        youtube: 'bg-[#FF0000]',
                        tiktok: 'bg-gray-800',
                        discord: 'bg-[#5865F2]',
                        twitch: 'bg-[#9146FF]',
                        website: 'bg-[#38BAFE]',
                        location: 'bg-[#84E523]',
                        default: 'bg-[#6B7280]',
                    };
                case 'dark-minimal':
                    return {
                        instagram: 'bg-white text-black',
                        github: 'bg-white text-black',
                        youtube: 'bg-white text-black',
                        tiktok: 'bg-white text-black',
                        discord: 'bg-white text-black',
                        twitch: 'bg-white text-black',
                        website: 'bg-white text-black',
                        location: 'bg-white text-black',
                        default: 'bg-white text-black',
                    };
                case 'light-minimal':
                    return {
                        instagram: 'bg-black text-white',
                        github: 'bg-black text-white',
                        youtube: 'bg-black text-white',
                        tiktok: 'bg-black text-white',
                        discord: 'bg-black text-white',
                        twitch: 'bg-black text-white',
                        website: 'bg-black text-white',
                        location: 'bg-black text-white',
                        default: 'bg-black text-white',
                    };
                default: // light theme
                    return {
                        instagram: 'bg-[#AC07C4]',
                        github: 'bg-[#333]',
                        youtube: 'bg-[#FF0000]',
                        tiktok: 'bg-[#000]',
                        discord: 'bg-[#5865F2]',
                        twitch: 'bg-[#9146FF]',
                        website: 'bg-[#38BAFE]',
                        location: 'bg-[#84E523]',
                        default: 'bg-[#6B7280]',
                    };
            }
        };

        // Define theme-based icon colors for containerized icons
        const getContainerIconColor = () => {
            switch (themeConfig.id) {
                case 'light-minimal':
                    return 'text-white';
                case 'dark-minimal':
                    return 'text-black';
                default:
                    return 'text-white';
            }
        };

        const iconColors = getIconColor(platform);
        const backgroundColors = getBackgroundColors();
        const containerIconColor = getContainerIconColor();

        switch (platform) {
            case 'twitter':
                return (
                    <div className="flex h-24 w-24 items-center justify-center">
                        <FontAwesomeIcon icon={faSquareXTwitter} className={iconColors.twitter} style={{ fontSize: '6.87rem' }} />
                    </div>
                );
            case 'instagram':
                return (
                    <div className={`flex h-24 w-24 items-center justify-center rounded-lg ${backgroundColors.instagram}`}>
                        <FontAwesomeIcon icon={faInstagram} className={`fa-4x ${containerIconColor}`} />
                    </div>
                );
            case 'linkedin':
                return (
                    <div className="flex h-24 w-24 items-center justify-center rounded-lg">
                        <FontAwesomeIcon icon={faLinkedin} className={`rounded-lg ${iconColors.linkedin}`} style={{ fontSize: '6.87rem' }} />
                    </div>
                );
            case 'github':
                return (
                    <div className={`flex h-24 w-24 items-center justify-center rounded-lg ${backgroundColors.github}`}>
                        <FontAwesomeIcon icon={faGithub} className={`fa-4x ${containerIconColor} `} />
                    </div>
                );
            case 'facebook':
                return (
                    <div className="flex h-24 w-24 items-center justify-center">
                        <FontAwesomeIcon icon={faSquareFacebook} className={iconColors.facebook} style={{ fontSize: '6.87rem' }} />
                    </div>
                );
            case 'youtube':
                return (
                    <div className={`flex h-24 w-24 items-center justify-center rounded-lg ${backgroundColors.youtube}`}>
                        <FontAwesomeIcon icon={faYoutube} className={`fa-4x ${containerIconColor}`} />
                    </div>
                );
            case 'tiktok':
                return (
                    <div className={`flex h-24 w-24 items-center justify-center rounded-lg ${backgroundColors.tiktok}`}>
                        <FontAwesomeIcon icon={faTiktok} className={`fa-4x ${containerIconColor}`} />
                    </div>
                );
            case 'discord':
                return (
                    <div className={`flex h-24 w-24 items-center justify-center rounded-lg ${backgroundColors.discord}`}>
                        <FontAwesomeIcon icon={faDiscord} className={`fa-4x ${containerIconColor}`} />
                    </div>
                );
            case 'twitch':
                return (
                    <div className={`flex h-24 w-24 items-center justify-center rounded-lg ${backgroundColors.twitch}`}>
                        <FontAwesomeIcon icon={faTwitch} className={`fa-4x ${containerIconColor}`} />
                    </div>
                );
            case 'website':
                return (
                    <div className={`flex h-24 w-24 items-center justify-center rounded-lg ${backgroundColors.website}`}>
                        <FontAwesomeIcon icon={faGlobe} className={`fa-4x ${containerIconColor}`} />
                    </div>
                );
            case 'location':
                return (
                    <div className={`flex h-24 w-24 items-center justify-center rounded-lg ${backgroundColors.location}`}>
                        <FontAwesomeIcon icon={faLocationDot} className={`fa-4x ${containerIconColor}`} />
                    </div>
                );
            default:
                return (
                    <div className={`flex h-24 w-24 items-center justify-center rounded-lg ${backgroundColors.default}`}>
                        <FontAwesomeIcon icon={faExternalLinkAlt} className={`fa-4x ${containerIconColor}`} />
                    </div>
                );
        }
    };

    const socialLinks = [
        { platform: 'website', value: data.website_url, isUrl: true },
        { platform: 'location', value: data.location, isUrl: false },
        { platform: 'twitter', value: data.twitter_username, isUrl: false },
        { platform: 'instagram', value: data.instagram_username, isUrl: false },
        { platform: 'linkedin', value: data.linkedin_username, isUrl: false },
        { platform: 'github', value: data.github_username, isUrl: false },
        { platform: 'facebook', value: data.facebook_username, isUrl: false },
        { platform: 'youtube', value: data.youtube_url, isUrl: true },
        { platform: 'tiktok', value: data.tiktok_username, isUrl: false },
        { platform: 'discord', value: data.discord_username, isUrl: false },
        { platform: 'twitch', value: data.twitch_username, isUrl: false },
    ].filter((link) => link.value);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button type="button" variant="outline" className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Preview Profile
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] max-w-md overflow-y-auto border-0 p-0">
                {/* Close button with circular background */}
                <DialogTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-4 right-4 z-20 h-8 w-8 rounded-full bg-white/80 p-0 shadow-lg backdrop-blur-sm hover:bg-white/90"
                    >
                        <X className="h-4 w-4 text-gray-600" />
                    </Button>
                </DialogTrigger>

                <div className={`relative flex min-h-[70vh] w-full items-start justify-center ${themeConfig.background}`}>
                    <div className="w-full">
                        <div className={`relative flex min-h-[70vh] w-full flex-col ${themeConfig.background}`}>
                            {/* Content */}
                            <div className="flex-1">
                                <div className="relative flex flex-col items-center">
                                    <div className="w-full">
                                        <BannerSection bannerUrl={previewProfile.banner_url} />
                                    </div>
                                    <Avatar
                                        className={`${themeConfig.cardBackground} ${themeConfig.borderClass} relative z-10 -mt-16 h-32 w-32 rounded-md border-4 border-white shadow-lg`}
                                    >
                                        <AvatarImage src={previewProfile.avatar_url} alt="Profile" />
                                        <AvatarFallback>
                                            <CircleUserRound className={`${themeConfig.textSecondary} text-2xl`} />
                                        </AvatarFallback>
                                    </Avatar>
                                </div>

                                <div className="mt-4 px-4 text-center">
                                    <h1 className={`text-2xl font-bold ${themeConfig.textPrimary}`}>
                                        {previewProfile.first_name} {previewProfile.last_name}
                                    </h1>

                                    {previewProfile.company_name && (
                                        <div className={`flex items-center justify-center gap-2 leading-relaxed ${themeConfig.textSecondary}`}>
                                            <LayoutDashboard className="h-4 w-4" />
                                            <span>{previewProfile.company_name}</span>
                                            {previewProfile.position && <span>• {previewProfile.position}</span>}
                                        </div>
                                    )}
                                    {previewProfile.bio && <p className={`leading-relaxed ${themeConfig.textSecondary}`}>{previewProfile.bio}</p>}

                                    <div className="mt-4 flex w-full justify-center gap-2">
                                        <Button
                                            type="button"
                                            size="sm"
                                            className={`${themeConfig.buttonPrimary} rounded-lg px-3 py-1 text-sm font-medium`}
                                        >
                                            <Phone className="mr-1 h-3 w-3" />
                                            Call
                                        </Button>
                                        <Button
                                            type="button"
                                            size="sm"
                                            className={`${themeConfig.buttonPrimary} rounded-lg px-3 py-1 text-sm font-medium`}
                                        >
                                            <MessageCircle className="mr-1 h-3 w-3" />
                                            Message
                                        </Button>
                                        <Button
                                            type="button"
                                            size="sm"
                                            className={`${themeConfig.buttonPrimary} rounded-lg px-3 py-1 text-sm font-medium`}
                                        >
                                            <Mail className="mr-1 h-3 w-3" />
                                            Email
                                        </Button>
                                    </div>
                                </div>

                                <div className="mt-4 flex w-full justify-center px-4">
                                    <Button
                                        type="button"
                                        size="lg"
                                        className={`${themeConfig.buttonSecondary} w-full rounded-lg px-4 py-3 text-center font-medium`}
                                    >
                                        Save Contact
                                    </Button>
                                </div>

                                <div className="mt-7 space-y-6 px-4">
                                    {/* Social Links */}
                                    {socialLinks.length > 0 && (
                                        <div className="space-y-3">
                                            <div className="gap-2 space-y-8">
                                                {Array.from({ length: Math.ceil(socialLinks.length / 3) }, (_, rowIndex) => (
                                                    <div key={rowIndex} className="flex justify-center gap-6">
                                                        {socialLinks.slice(rowIndex * 3, rowIndex * 3 + 3).map((link, index) => (
                                                            <div key={rowIndex * 3 + index}>{getSocialIcon(link.platform)}</div>
                                                        ))}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Services */}
                                    {previewProfile.services && previewProfile.services.length > 0 && (
                                        <>
                                            <div className="flex justify-center">
                                                <div
                                                    className="w-full overflow-hidden rounded-lg border px-4 py-2 shadow-md md:w-[80%]"
                                                    onClick={() => setIsServicesExpanded(!isServicesExpanded)}
                                                >
                                                    <h3 className={`text-left text-lg font-semibold ${themeConfig.textPrimary}`}>Services</h3>
                                                    <div
                                                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                                            isServicesExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                                        }`}
                                                    >
                                                        <div className="ml-[-20px] flex flex-col items-start gap-3 p-4 pt-0">
                                                            {/* Remove duplicates by filtering unique service IDs */}
                                                            {previewProfile.services
                                                                .filter(
                                                                    (service, index, self) => index === self.findIndex((s) => s.id === service.id),
                                                                )
                                                                .map((service) => (
                                                                    <div
                                                                        key={service.id}
                                                                        className={`mt-3 w-full border-b-2 px-3 py-1 text-sm ${themeConfig.textPrimary} ${themeConfig.border}`}
                                                                    >
                                                                        {service.name}
                                                                    </div>
                                                                ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {/* Custom Links */}
                                    {allCustomLinks.length > 0 && (
                                        <div className="flex w-full flex-col space-y-2">
                                            <h3 className={`text-center text-lg font-semibold ${themeConfig.textPrimary}`}>Other Links</h3>
                                            <div className="flex w-full flex-col gap-2">
                                                {allCustomLinks.map((link, index) => (
                                                    <div
                                                        key={index}
                                                        className={`flex w-full items-center justify-between rounded-lg border px-4 py-2 transition-all hover:shadow-md ${themeConfig.cardBackground} ${themeConfig.border} ${themeConfig.textPrimary}`}
                                                    >
                                                        <span className="font-medium">{link.name}</span>
                                                        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                                            />
                                                        </svg>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Footer with App Logo */}
                            <footer className="mt-6 flex flex-col items-center justify-center gap-2 px-4 pb-4">
                                {themeConfig.id === 'dark' || themeConfig.id === 'dark-minimal' ? (
                                    <AppLogoIconWhite className="h-4 w-20" />
                                ) : (
                                    <AppLogoIcon className="h-4 w-20" />
                                )}
                            </footer>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

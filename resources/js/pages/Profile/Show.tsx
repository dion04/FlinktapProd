import AppLogoIcon from '@/components/app-logo-icon';
import AppLogoIconWhite from '@/components/app-logo-icon-white';
import BannerSection from '@/components/Profile/BannerSection';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
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
import { Head, Link } from '@inertiajs/react';
import { CircleUserRound, Mail, MessageCircle, Phone } from 'lucide-react';
import { useState } from 'react';

interface Profile {
    id: number;
    slug: string;
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
    custom_links?: Array<{ name: string; url: string }>;
    services?: Array<{ id: string; name: string; isCustom?: boolean }>;
    is_public: boolean;
    theme: string;
    location?: string;
    company_name?: string;
    position?: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
    resolve_code: {
        id: number;
        code: string;
        type: string;
    };
}

interface ProfileShowProps {
    profile: Profile;
    auth?: {
        user: {
            id: number;
        };
    };
}

export default function ProfileShow({ profile, auth }: ProfileShowProps) {
    const isOwner = auth?.user?.id === profile.user.id;
    const [isServicesExpanded, setIsServicesExpanded] = useState(false);

    // Get theme configuration
    const themeConfig = getThemeConfig(profile.theme || 'light');

    // Function to generate vCard content
    const generateVCard = () => {
        const vCard = [
            'BEGIN:VCARD',
            'VERSION:3.0',
            `FN:${profile.first_name} ${profile.last_name}`,
            `N:${profile.last_name};${profile.first_name};;;`,
        ];

        if (profile.user.email) {
            vCard.push(`EMAIL:${profile.user.email}`);
        }

        if (profile.phone_number) {
            vCard.push(`TEL:${profile.phone_number}`);
        }

        if (profile.avatar_url) {
            vCard.push(`PHOTO:${profile.avatar_url}`);
        }

        if (profile.website_url) {
            vCard.push(`URL:${profile.website_url}`);
        }

        if (profile.company_name) {
            vCard.push(`ORG:${profile.company_name}`);
            if (profile.position) {
                vCard.push(`TITLE:${profile.position}`);
            }
        }

        if (profile.location) {
            vCard.push(`ADR:;;;;;;${profile.location}`);
        }

        if (profile.bio) {
            vCard.push(`NOTE:${profile.bio}`);
        }

        // Add all social media URLs with proper labels
        if (profile.twitter_username) {
            vCard.push(`URL;type=Twitter:https://twitter.com/${profile.twitter_username}`);
        }
        if (profile.instagram_username) {
            vCard.push(`URL;type=Instagram:https://instagram.com/${profile.instagram_username}`);
        }
        if (profile.linkedin_username) {
            vCard.push(`URL;type=LinkedIn:https://linkedin.com/in/${profile.linkedin_username}`);
        }
        if (profile.github_username) {
            vCard.push(`URL;type=GitHub:https://github.com/${profile.github_username}`);
        }
        if (profile.facebook_username) {
            vCard.push(`URL;type=Facebook:https://facebook.com/${profile.facebook_username}`);
        }
        if (profile.youtube_url) {
            vCard.push(`URL;type=YouTube:${profile.youtube_url}`);
        }
        if (profile.tiktok_username) {
            vCard.push(`URL;type=TikTok:https://tiktok.com/@${profile.tiktok_username}`);
        }
        if (profile.discord_username) {
            vCard.push(`NOTE:Discord: ${profile.discord_username}`);
        }
        if (profile.twitch_username) {
            vCard.push(`URL;type=Twitch:https://twitch.tv/${profile.twitch_username}`);
        }

        // Add custom links with their names
        if (profile.custom_links && profile.custom_links.length > 0) {
            profile.custom_links.forEach((link) => {
                vCard.push(`URL;type=${link.name}:${link.url}`);
            });
        }

        vCard.push('END:VCARD');
        return vCard.join('\r\n');
    };

    // Function to save contact
    const saveContact = () => {
        const vCardData = generateVCard();
        const blob = new Blob([vCardData], { type: 'text/vcard' });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `${profile.first_name}_${profile.last_name}.vcf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    };

    // Function to handle phone call
    const handleCall = () => {
        if (profile.phone_number) {
            window.location.href = `tel:${profile.phone_number}`;
        } else {
            alert('No phone number available');
        }
    };

    // Function to handle messaging
    const handleMessage = () => {
        if (profile.phone_number) {
            // Try SMS first, fallback to WhatsApp if available
            const userAgent = navigator.userAgent || navigator.vendor;
            if (/android/i.test(userAgent)) {
                window.location.href = `sms:${profile.phone_number}`;
            } else if (/iPad|iPhone|iPod/.test(userAgent)) {
                window.location.href = `sms:${profile.phone_number}`;
            } else {
                // Desktop fallback to WhatsApp Web
                window.open(`https://wa.me/${profile.phone_number.replace(/[^\d]/g, '')}`, '_blank');
            }
        } else {
            alert('No phone number available');
        }
    };

    // Function to handle email
    const handleEmail = () => {
        if (profile.user.email) {
            window.location.href = `mailto:${profile.user.email}?subject=Hello ${profile.first_name}`;
        } else {
            alert('No email address available');
        }
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

    const getSocialUrl = (platform: string, username: string) => {
        switch (platform) {
            case 'twitter':
                return `https://twitter.com/${username}`;
            case 'instagram':
                return `https://instagram.com/${username}`;
            case 'linkedin':
                return `https://linkedin.com/in/${username}`;
            case 'github':
                return `https://github.com/${username}`;
            case 'facebook':
                return `https://facebook.com/${username}`;
            case 'tiktok':
                return `https://tiktok.com/@${username}`;
            case 'twitch':
                return `https://twitch.tv/${username}`;
            case 'location':
                return `https://maps.google.com/?q=${encodeURIComponent(username)}`;
            default:
                return username;
        }
    };

    const socialLinks = [
        { platform: 'website', value: profile.website_url, isUrl: true },
        { platform: 'location', value: profile.location, isUrl: false },
        { platform: 'twitter', value: profile.twitter_username, isUrl: false },
        { platform: 'instagram', value: profile.instagram_username, isUrl: false },
        { platform: 'linkedin', value: profile.linkedin_username, isUrl: false },
        { platform: 'github', value: profile.github_username, isUrl: false },
        { platform: 'facebook', value: profile.facebook_username, isUrl: false },
        { platform: 'youtube', value: profile.youtube_url, isUrl: true },
        { platform: 'tiktok', value: profile.tiktok_username, isUrl: false },
        { platform: 'discord', value: profile.discord_username, isUrl: false },
        { platform: 'twitch', value: profile.twitch_username, isUrl: false },
    ].filter((link) => link.value);

    return (
        <>
            <Head title={`${profile.first_name} ${profile.last_name} - Profile`} />

            <div className={`relative flex min-h-screen w-full items-start justify-center md:flex-col ${themeConfig.background} px-0 py-0 md:pb-8`}>
                {/* Full-width banner for mobile only */}
                <div className="absolute top-0 left-1/2 w-full -translate-x-1/2 md:hidden">
                    <BannerSection bannerUrl={profile.banner_url} />
                </div>

                <div className={`mx-auto w-[90%] max-w-full md:w-[26%]`}>
                    <div
                        className={`relative mt-40 flex min-h-[82vh] w-full flex-col pt-16 md:mt-8 md:rounded-lg md:border md:border-gray-200 md:px-0 md:pt-0 md:pb-8 md:shadow-lg`}
                    >
                        {/* Content */}
                        <div className="flex-1">
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 transform md:static md:flex md:translate-x-0 md:flex-col md:items-center">
                                <div className="hidden w-full md:block">
                                    <BannerSection bannerUrl={profile.banner_url} />
                                </div>
                                <Avatar className={`${themeConfig.cardBackground} h-32 w-32 rounded-md border-4 border-white shadow-lg`}>
                                    {profile.avatar_url ? (
                                        <AvatarImage src={profile.avatar_url} alt={`${profile.first_name} ${profile.last_name}`} />
                                    ) : (
                                        <AvatarFallback className={`${themeConfig.textPrimary} text-2xl`}>
                                            {`${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase()}
                                        </AvatarFallback>
                                    )}
                                </Avatar>

                                {/* Banner positioned under avatar on desktop only */}
                            </div>

                            <div className="mt-4 px-2 text-center md:px-6">
                                <h1 className={`mt-12 text-2xl font-bold md:mt-4 ${themeConfig.textPrimary}`}>
                                    {`${profile.first_name} ${profile.last_name}`}
                                </h1>

                                {profile.company_name && (
                                    <p className={`flex items-center justify-center gap-2 leading-relaxed ${themeConfig.textSecondary}`}>
                                        <span>{profile.position}</span>
                                        <span className="inline-block h-4 w-px bg-gray-400" />
                                        <span className="font-bold">{profile.company_name}</span>
                                    </p>
                                )}
                                {profile.bio && <p className={`text-xs leading-relaxed ${themeConfig.textSecondary}`}>{profile.bio}</p>}
                                {isOwner && (
                                    <div className="mt-4 flex justify-center gap-2">
                                        <Link href={route('profile.edit', profile.slug)}>
                                            <Button variant={'outline'} size="sm">
                                                Edit Profile
                                            </Button>
                                        </Link>
                                        <Link href={route('dashboard')}>
                                            <Button variant={'outline'} size="sm">
                                                Dashboard
                                            </Button>
                                        </Link>
                                    </div>
                                )}

                                <div className="mt-4 flex w-full justify-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        onClick={handleCall}
                                        className={`${themeConfig.buttonPrimary} w-1/3 transition-shadow hover:shadow-md`}
                                        title="Call"
                                    >
                                        <Phone className="h-12 w-12 text-2xl" />
                                        Call
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        onClick={handleMessage}
                                        className={`${themeConfig.buttonPrimary} w-1/3 transition-shadow hover:shadow-md`}
                                        title="Message"
                                    >
                                        <MessageCircle className="h-12 w-12 text-2xl" />
                                        Message
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        onClick={handleEmail}
                                        className={`${themeConfig.buttonPrimary} w-1/3 transition-shadow hover:shadow-md`}
                                        title="Email"
                                    >
                                        <Mail className="h-12 w-12 text-2xl" />
                                        Email
                                    </Button>
                                </div>
                            </div>

                            <div className="mt-4 flex w-full justify-center px-2 md:px-6">
                                <Button
                                    variant="default"
                                    size="lg"
                                    onClick={saveContact}
                                    className={`${themeConfig.buttonSecondary} w-full transition-shadow hover:shadow-md`}
                                    title="Save Contact"
                                >
                                    <CircleUserRound
                                        size={96}
                                        className="h-24 w-24"
                                        style={{ width: '30px !important', height: '30px !important', minWidth: '30px', minHeight: '30px' }}
                                    />
                                    Save Contact
                                </Button>
                            </div>

                            <div className="mt-7 space-y-6">
                                {socialLinks.length > 0 && (
                                    <div className="space-y-3">
                                        <div className="gap-2 space-y-8">
                                            {Array.from({ length: Math.ceil(socialLinks.length / 3) }, (_, rowIndex) => (
                                                <div key={rowIndex} className="flex justify-center gap-6">
                                                    {socialLinks.slice(rowIndex * 3, rowIndex * 3 + 3).map((link, index) => (
                                                        <a
                                                            key={rowIndex * 3 + index}
                                                            href={link.isUrl ? link.value : getSocialUrl(link.platform, link.value!)}
                                                            target={link.platform === 'location' ? '_blank' : '_blank'}
                                                            rel="noopener noreferrer"
                                                            title={link.platform === 'location' ? `View ${link.value} on map` : link.platform}
                                                        >
                                                            {getSocialIcon(link.platform)}
                                                        </a>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {profile.services && profile.services.length > 0 && (
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
                                                        {profile.services
                                                            .filter((service, index, self) => index === self.findIndex((s) => s.id === service.id))
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

                                {/* Custom Links Section */}
                                {profile.custom_links && profile.custom_links.length > 0 && (
                                    <div className="flex w-full flex-col space-y-2 md:px-12">
                                        <h3 className={`text-center text-lg font-semibold ${themeConfig.textPrimary}`}>Other Links</h3>
                                        <div className="flex w-full flex-col gap-2">
                                            {profile.custom_links.map((link, index) => (
                                                <a
                                                    key={index}
                                                    href={link.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
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
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer with Contact Support */}
                        <footer className="mt-6 flex flex-col items-center justify-center gap-2">
                            {themeConfig.id === 'dark' || themeConfig.id === 'dark-minimal' ? (
                                <AppLogoIconWhite className={`${!isOwner ? 'mb-10' : ''} h-4 w-20`} />
                            ) : (
                                <AppLogoIcon className={`${!isOwner ? 'mb-10' : ''} h-4 w-20`} />
                            )}
                            {/* HERE IS THE CONTACT SUPPORT BUTTON */}
                            {/* {isOwner && (
                                <Link
                                    href={route('contact.support')}
                                    className="my-4 inline-block w-[70%] rounded-[90px] border-2 border-gray-300 bg-gray-50 px-4 py-2 text-center text-base font-medium text-gray-700 shadow-lg transition-all hover:border-gray-400 hover:bg-gray-100 hover:shadow-xl"
                                >
                                    Contact Support
                                </Link>
                            )} */}
                        </footer>
                    </div>
                </div>
            </div>
        </>
    );
}

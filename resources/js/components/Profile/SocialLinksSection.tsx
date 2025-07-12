import { Input } from '@/components/ui/input';
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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface SocialLinksSectionProps {
    data: any;
    setData: (field: string, value: any) => void;
    errors: any;
}

export default function SocialLinksSection({ data, setData, errors }: SocialLinksSectionProps) {
    return (
        <div className="space-y-4 p-6">
            <h3 className="text-lg font-semibold">Social Media</h3>
            <p className="mt-[-12px] text-sm text-gray-600">Fill out all the information you want to put in your card.</p>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex items-center space-x-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-100">
                        <FontAwesomeIcon icon={faSquareXTwitter} className="h-5 w-5 text-gray-600" />
                    </div>
                    <Input
                        id="twitter_username"
                        type="text"
                        value={data.twitter_username}
                        onChange={(e) => setData('twitter_username', e.target.value)}
                        className="flex-1"
                        placeholder="Twitter username"
                    />
                </div>

                <div className="flex items-center space-x-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-100">
                        <FontAwesomeIcon icon={faInstagram} className="h-5 w-5 text-gray-600" />
                    </div>
                    <Input
                        id="instagram_username"
                        type="text"
                        value={data.instagram_username}
                        onChange={(e) => setData('instagram_username', e.target.value)}
                        className="flex-1"
                        placeholder="Instagram username"
                    />
                </div>

                <div className="flex items-center space-x-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-100">
                        <FontAwesomeIcon icon={faLinkedin} className="h-5 w-5 text-gray-600" />
                    </div>
                    <Input
                        id="linkedin_username"
                        type="text"
                        value={data.linkedin_username}
                        onChange={(e) => setData('linkedin_username', e.target.value)}
                        className="flex-1"
                        placeholder="LinkedIn username"
                    />
                </div>

                <div className="flex items-center space-x-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-100">
                        <FontAwesomeIcon icon={faGithub} className="h-5 w-5 text-gray-600" />
                    </div>
                    <Input
                        id="github_username"
                        type="text"
                        value={data.github_username}
                        onChange={(e) => setData('github_username', e.target.value)}
                        className="flex-1"
                        placeholder="GitHub username"
                    />
                </div>

                <div className="flex items-center space-x-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-100">
                        <FontAwesomeIcon icon={faSquareFacebook} className="h-5 w-5 text-gray-600" />
                    </div>
                    <Input
                        id="facebook_username"
                        type="text"
                        value={data.facebook_username}
                        onChange={(e) => setData('facebook_username', e.target.value)}
                        className="flex-1"
                        placeholder="Facebook username"
                    />
                </div>

                <div className="flex items-center space-x-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-100">
                        <FontAwesomeIcon icon={faYoutube} className="h-5 w-5 text-gray-600" />
                    </div>
                    <Input
                        id="youtube_url"
                        type="url"
                        value={data.youtube_url}
                        onChange={(e) => setData('youtube_url', e.target.value)}
                        className="flex-1"
                        placeholder="YouTube channel URL"
                    />
                </div>

                <div className="flex items-center space-x-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-100">
                        <FontAwesomeIcon icon={faTiktok} className="h-5 w-5 text-gray-600" />
                    </div>
                    <Input
                        id="tiktok_username"
                        type="text"
                        value={data.tiktok_username}
                        onChange={(e) => setData('tiktok_username', e.target.value)}
                        className="flex-1"
                        placeholder="TikTok username"
                    />
                </div>

                <div className="flex items-center space-x-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-100">
                        <FontAwesomeIcon icon={faDiscord} className="h-5 w-5 text-gray-600" />
                    </div>
                    <Input
                        id="discord_username"
                        type="text"
                        value={data.discord_username}
                        onChange={(e) => setData('discord_username', e.target.value)}
                        className="flex-1"
                        placeholder="Discord username#1234"
                    />
                </div>

                <div className="flex items-center space-x-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-100">
                        <FontAwesomeIcon icon={faTwitch} className="h-5 w-5 text-gray-600" />
                    </div>
                    <Input
                        id="twitch_username"
                        type="text"
                        value={data.twitch_username}
                        onChange={(e) => setData('twitch_username', e.target.value)}
                        className="flex-1"
                        placeholder="Twitch username"
                    />
                </div>
            </div>
        </div>
    );
}

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface BasicInfoSectionProps {
    data: any;
    setData: (field: string, value: any) => void;
    errors: any;
}

export default function BasicInfoSection({ data, setData, errors }: BasicInfoSectionProps) {
    return (
        <div className="mt-16 space-y-4 p-6">
            <h3 className="mt-[-12px] text-lg font-semibold">Personal Information</h3>
            <p className="mt-[-12px] text-sm text-gray-600">Fill out all the information you want to put in your card.</p>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="first_name">Full Name *</Label>
                    <Input
                        id="first_name"
                        type="text"
                        value={data.first_name}
                        placeholder="First Name"
                        onChange={(e) => setData('first_name', e.target.value)}
                        className="mt-1"
                        required
                    />
                    {errors.first_name && <p className="mt-1 text-sm text-red-600">{errors.first_name}</p>}
                </div>
                <div>
                    <Label htmlFor="last_name">&nbsp;</Label>
                    <Input
                        id="last_name"
                        type="text"
                        value={data.last_name}
                        placeholder="Last Name"
                        onChange={(e) => setData('last_name', e.target.value)}
                        className="mt-1"
                        required
                    />
                    {errors.last_name && <p className="mt-1 text-sm text-red-600">{errors.last_name}</p>}
                </div>
            </div>
            <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                    id="bio"
                    value={data.bio}
                    onChange={(e: { target: { value: string } }) => setData('bio', e.target.value)}
                    className="mt-1"
                    rows={3}
                    placeholder="Tell people about yourself..."
                />
                {errors.bio && <p className="mt-1 text-sm text-red-600">{errors.bio}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="company_name">Company</Label>
                    <Input
                        id="company_name"
                        type="text"
                        value={data.company_name}
                        onChange={(e) => setData('company_name', e.target.value)}
                        placeholder="Company Name"
                        className="mt-1"
                    />
                    {errors.company_name && <p className="mt-1 text-sm text-red-600">{errors.company_name}</p>}
                </div>
                <div>
                    <Label htmlFor="position">&nbsp;</Label>
                    <Input
                        id="position"
                        type="text"
                        value={data.position}
                        placeholder="Position"
                        onChange={(e) => setData('position', e.target.value)}
                        className="mt-1"
                    />
                    {errors.position && <p className="mt-1 text-sm text-red-600">{errors.position}</p>}
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="phone_number">Phone *</Label>
                    <Input
                        id="phone_number"
                        type="tel"
                        value={data.phone_number}
                        onChange={(e) => setData('phone_number', e.target.value)}
                        className="mt-1"
                        placeholder="+1234567890"
                        required
                    />
                    {errors.phone_number && <p className="mt-1 text-sm text-red-600">{errors.phone_number}</p>}
                </div>
                <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className="mt-1"
                        placeholder="your@email.com"
                        required
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                        id="location"
                        type="text"
                        value={data.location}
                        onChange={(e) => setData('location', e.target.value)}
                        className="mt-1"
                        placeholder="City, Country"
                    />
                </div>
                <div>
                    <Label htmlFor="website_url">Website</Label>
                    <Input
                        id="website_url"
                        type="url"
                        value={data.website_url}
                        onChange={(e) => setData('website_url', e.target.value)}
                        className="mt-1"
                        placeholder="https://yourwebsite.com"
                    />
                </div>
            </div>
        </div>
    );
}

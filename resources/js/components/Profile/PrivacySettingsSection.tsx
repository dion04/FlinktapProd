import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface PrivacySettingsSectionProps {
    isPublic: boolean;
    setData: (field: string, value: any) => void;
}

export default function PrivacySettingsSection({ isPublic, setData }: PrivacySettingsSectionProps) {
    return (
        <div className="space-y-4 p-6">
            <h3 className="text-lg font-semibold">Privacy Settings</h3>
            <div className="flex items-center space-x-2">
                <Checkbox id="is_public" checked={isPublic} onCheckedChange={(checked) => setData('is_public', checked)} />
                <Label htmlFor="is_public">Make profile public</Label>
            </div>
            <p className="text-sm text-gray-600">When public, anyone can view your profile when they scan your code.</p>
        </div>
    );
}

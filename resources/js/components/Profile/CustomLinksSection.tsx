import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2 } from 'lucide-react';

interface CustomLink {
    name: string;
    url: string;
}

interface CustomLinksSectionProps {
    customLinks: CustomLink[];
    addCustomLink: () => void;
    removeCustomLink: (index: number) => void;
    updateCustomLink: (index: number, field: 'name' | 'url', value: string) => void;
}

export default function CustomLinksSection({ customLinks, addCustomLink, removeCustomLink, updateCustomLink }: CustomLinksSectionProps) {
    return (
        <div className="space-y-4 p-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Custom Links</h3>
                <Button type="button" onClick={addCustomLink}>
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
            {customLinks.map((link, index) => (
                <div key={index} className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Input type="text" placeholder="Name" value={link.name} onChange={(e) => updateCustomLink(index, 'name', e.target.value)} />
                    <div className="relative">
                        <Input type="url" placeholder="URL" value={link.url} onChange={(e) => updateCustomLink(index, 'url', e.target.value)} />
                        <button type="button" onClick={() => removeCustomLink(index)} className="absolute top-2 right-2 text-red-500">
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

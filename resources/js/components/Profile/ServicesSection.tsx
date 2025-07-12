import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Plus, Trash2 } from 'lucide-react';

// Using any to avoid type conflicts with parent Service
interface ServicesSectionProps {
    predefinedServices: any[];
    selectedServices: any[];
    customServices: any[];
    toggleService: (service: any) => void;
    addCustomService: () => void;
    removeCustomService: (id: string) => void;
    newCustomService: string;
    setNewCustomService: (val: string) => void;
}

export default function ServicesSection({
    predefinedServices,
    selectedServices,
    customServices,
    toggleService,
    addCustomService,
    removeCustomService,
    newCustomService,
    setNewCustomService,
}: ServicesSectionProps) {
    return (
        <div className="space-y-4 p-6">
            <h3 className="text-lg font-semibold">Services</h3>
            <p className="text-sm text-gray-600">Select the services you offer or add your own custom services.</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                {predefinedServices.map((service) => {
                    const isSelected = selectedServices.some((s) => s.id === service.id);
                    return (
                        <div
                            key={service.id}
                            className={`flex items-center space-x-2 rounded-lg border p-3 ${
                                isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
                            }`}
                        >
                            <Checkbox id={`service-${service.id}`} checked={isSelected} onCheckedChange={() => toggleService(service)} />
                            <label htmlFor={`service-${service.id}`} className="flex-1 cursor-pointer text-sm">
                                {service.name}
                            </label>
                        </div>
                    );
                })}
            </div>
            <div className="mt-4 flex items-center space-x-2">
                <Input type="text" placeholder="Add custom service" value={newCustomService} onChange={(e) => setNewCustomService(e.target.value)} />
                <Button type="button" onClick={addCustomService} disabled={!newCustomService.trim()}>
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
            <div className="mt-2 space-y-2">
                {customServices.map((service) => (
                    <div key={service.id} className="flex items-center justify-between rounded-lg border bg-white p-3 text-sm">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id={`custom-service-${service.id}`}
                                checked={selectedServices.some((s) => s.id === service.id)}
                                onCheckedChange={() => toggleService(service)}
                            />
                            <label htmlFor={`custom-service-${service.id}`} className="cursor-pointer">
                                {service.name}
                            </label>
                        </div>
                        <button type="button" onClick={() => removeCustomService(service.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

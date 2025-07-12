import { getThemeConfig, themes } from '@/lib/themes';
import { Check } from 'lucide-react';

interface ThemeSettingsSectionProps {
    data: {
        theme: string;
    };
    setData: (key: string, value: any) => void;
}

export default function ThemeSettingsSection({ data, setData }: ThemeSettingsSectionProps) {
    const currentTheme = data.theme || 'light';

    return (
        <div className="space-y-6 p-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-900">Theme Settings</h3>
                <p className="mt-1 text-sm text-gray-600">Choose how your profile appears to visitors</p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {Object.values(themes).map((theme) => {
                    const isSelected = currentTheme === theme.id;
                    const themeConfig = getThemeConfig(theme.id);

                    return (
                        <button
                            key={theme.id}
                            type="button"
                            onClick={() => setData('theme', theme.id)}
                            className={`group relative overflow-hidden rounded-xl border-2 p-4 text-left transition-all duration-200 hover:scale-105 ${
                                isSelected
                                    ? 'border-blue-500 shadow-lg ring-2 ring-blue-500 ring-offset-2'
                                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                            }`}
                        >
                            {/* Theme Preview Container */}
                            <div className={`relative h-32 w-full overflow-hidden rounded-lg ${themeConfig.background} ${themeConfig.borderClass}`}>
                                {/* Background pattern for dark-minimal theme */}
                                {theme.id === 'dark-minimal' && (
                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900" />
                                )}

                                {/* Background pattern for light-minimal theme */}
                                {theme.id === 'light-minimal' && <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100" />}

                                {/* Mock profile preview content */}
                                <div className={`relative z-10 h-full p-3 ${themeConfig.cardBackground}`}>
                                    {/* Mock avatar */}
                                    <div className="flex items-start gap-3">
                                        <div
                                            className={`h-8 w-8 rounded-md ${
                                                theme.id === 'dark-minimal'
                                                    ? 'bg-white/20'
                                                    : theme.id === 'dark'
                                                      ? 'bg-gray-600'
                                                      : theme.id === 'light-minimal'
                                                        ? 'bg-gray-300'
                                                        : 'bg-gray-200'
                                            }`}
                                        />
                                        <div className="flex-1">
                                            {/* Mock name */}
                                            <div
                                                className={`mb-1 h-2 w-16 rounded ${themeConfig.textPrimary.includes('gray-100') ? 'bg-gray-100' : themeConfig.textPrimary.includes('gray-800') ? 'bg-gray-800' : 'bg-gray-900'}`}
                                            />
                                            {/* Mock subtitle */}
                                            <div
                                                className={`h-1.5 w-12 rounded ${themeConfig.textSecondary.includes('gray-300') ? 'bg-gray-300' : themeConfig.textSecondary.includes('gray-500') ? 'bg-gray-500' : 'bg-gray-600'}`}
                                            />
                                        </div>
                                    </div>

                                    {/* Mock action buttons */}
                                    <div className="mt-3 flex gap-1">
                                        <div
                                            className={`h-4 w-8 rounded-sm ${
                                                theme.id === 'dark-minimal'
                                                    ? 'bg-white'
                                                    : theme.id === 'dark'
                                                      ? 'bg-blue-500'
                                                      : theme.id === 'light-minimal'
                                                        ? 'bg-black'
                                                        : 'bg-blue-600'
                                            }`}
                                        />
                                        <div
                                            className={`h-4 w-8 rounded-sm ${
                                                theme.id === 'dark-minimal'
                                                    ? 'bg-white/70'
                                                    : theme.id === 'dark'
                                                      ? 'bg-blue-400'
                                                      : theme.id === 'light-minimal'
                                                        ? 'bg-gray-700'
                                                        : 'bg-blue-500'
                                            }`}
                                        />
                                    </div>

                                    {/* Mock social icons */}
                                    <div className="absolute right-2 bottom-2 flex gap-1">
                                        <div
                                            className={`h-3 w-3 rounded ${
                                                theme.id === 'dark-minimal'
                                                    ? 'bg-purple-400'
                                                    : theme.id === 'dark'
                                                      ? 'bg-purple-500'
                                                      : theme.id === 'light-minimal'
                                                        ? 'bg-gray-600'
                                                        : 'bg-purple-600'
                                            }`}
                                        />
                                        <div
                                            className={`h-3 w-3 rounded ${
                                                theme.id === 'dark-minimal'
                                                    ? 'bg-blue-400'
                                                    : theme.id === 'dark'
                                                      ? 'bg-blue-500'
                                                      : theme.id === 'light-minimal'
                                                        ? 'bg-gray-500'
                                                        : 'bg-blue-600'
                                            }`}
                                        />
                                        <div
                                            className={`h-3 w-3 rounded ${
                                                theme.id === 'dark-minimal'
                                                    ? 'bg-green-400'
                                                    : theme.id === 'dark'
                                                      ? 'bg-green-500'
                                                      : theme.id === 'light-minimal'
                                                        ? 'bg-gray-400'
                                                        : 'bg-green-600'
                                            }`}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Selection indicator */}
                            {isSelected && (
                                <div className="absolute top-0 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg">
                                    <Check className="h-3 w-3" />
                                </div>
                            )}

                            {/* Theme name and description */}
                            <div className="mt-3">
                                <h4 className={`font-medium ${isSelected ? 'text-blue-600' : 'text-gray-900'}`}>{theme.name}</h4>
                                <p className="mt-1 text-xs text-gray-500">
                                    {theme.id === 'light' && 'Classic white background with blue accents'}
                                    {theme.id === 'dark' && 'Sleek black background with gray cards'}
                                    {theme.id === 'dark-minimal' && 'Black theme with white elements'}
                                    {theme.id === 'light-minimal' && 'Minimal gray background design'}
                                </p>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

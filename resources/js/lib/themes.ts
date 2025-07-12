export interface ThemeConfig {
    id: string;
    name: string;
    background: string;
    cardBackground: string;
    textPrimary: string;
    textSecondary: string;
    border: string;
    accent: string;
    buttonPrimary: string;
    buttonSecondary: string;
    shadowClass: string;
    borderClass: string;
}

export const themes: Record<string, ThemeConfig> = {
    light: {
        id: 'light',
        name: 'Light',
        background: 'bg-white',
        cardBackground: 'bg-white',
        textPrimary: 'text-gray-900',
        textSecondary: 'text-gray-600',
        border: 'border-gray-200',
        accent: 'text-blue-600',
        buttonPrimary: 'bg-white text-[#5D87C5] hover:bg-blue-700',
        buttonSecondary: 'bg-[#5D87C5] text-white hover:bg-gray-200',
        shadowClass: 'shadow-lg',
        borderClass: 'border border-gray-200',
    },
    dark: {
        id: 'dark',
        name: 'Dark',
        background: 'bg-black',
        cardBackground: 'bg-gray-800',
        textPrimary: 'text-gray-100',
        textSecondary: 'text-gray-300',
        border: 'border-gray-700',
        accent: 'text-blue-400',
        buttonPrimary: 'bg-black border-[#5D87C5] text-[#5D87C5] hover:bg-blue-700',
        buttonSecondary: 'bg-[#5D87C5] text-white hover:bg-gray-200',
        shadowClass: 'shadow-2xl',
        borderClass: 'border border-gray-700',
    },
    'dark-minimal': {
        id: 'dark-minimal',
        name: 'Dark Minimal',
        background: 'bg-black',
        cardBackground: 'bg-gray-800',
        textPrimary: 'text-gray-100',
        textSecondary: 'text-gray-300',
        border: 'border-gray-700',
        accent: 'text-blue-400',
        buttonPrimary: 'bg-black border-white text-white hover:bg-blue-700',
        buttonSecondary: 'bg-white text-black hover:bg-gray-200',
        shadowClass: 'shadow-2xl',
        borderClass: 'border border-gray-700',
    },
    'light-minimal': {
        id: 'light-minimal',
        name: 'Light Minimal',
        background: 'bg-gray-50',
        cardBackground: 'bg-white',
        textPrimary: 'text-gray-800',
        textSecondary: 'text-gray-500',
        border: 'border-gray-100',
        accent: 'text-gray-800',
        buttonPrimary: 'bg-white border text-black hover:bg-gray-900',
        buttonSecondary: 'bg-black text-white hover:bg-gray-100 border border-gray-300',
        shadowClass: 'shadow-sm',
        borderClass: 'border border-gray-100',
    },
};

export const getThemeConfig = (themeId: string): ThemeConfig => {
    return themes[themeId] || themes.light;
};

import { RoleColorMap } from '@/types/admin/analytics';

// Define enhanced colors and gradients for the role pie chart
export const roleColors: RoleColorMap = {
    superadmin: {
        fill: '#8B5CF6',
        gradient: ['#9333EA', '#7C3AED'],
        shadow: '0 10px 15px -3px rgba(124, 58, 237, 0.3)',
    },
    admin: {
        fill: '#3B82F6',
        gradient: ['#2563EB', '#3B82F6'],
        shadow: '0 10px 15px -3px rgba(59, 130, 246, 0.3)',
    },
    user: {
        fill: '#10B981',
        gradient: ['#059669', '#10B981'],
        shadow: '0 10px 15px -3px rgba(16, 185, 129, 0.3)',
    },
    default: {
        fill: '#6B7280',
        gradient: ['#4B5563', '#6B7280'],
        shadow: '0 10px 15px -3px rgba(107, 114, 128, 0.3)',
    },
};

export const getRoleColor = (role: string) => {
    if (role in roleColors) {
        return roleColors[role as keyof typeof roleColors];
    }
    return roleColors.default;
};

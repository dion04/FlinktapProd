export interface AnalyticsData {
    nfc_codes: {
        total: number;
        assigned: number;
        unassigned: number;
        this_week: number;
        this_month: number;
        assignment_rate: number;
    };
    users: {
        total: number;
        this_week: number;
        this_month: number;
        by_role: Record<string, number>;
    };
    activity: {
        last_7_days: Array<{
            date: string;
            nfc_codes: number;
            users: number;
        }>;
        top_creators: Array<{
            name: string;
            codes_created: number;
        }>;
    };
    recent: {
        nfc_codes: Array<{
            id: number;
            code: string;
            status: string;
            user?: { name: string } | null;
            creator?: { name: string } | null;
            created_at: string;
        }>;
    };
}

export interface AdminDashboardProps {
    analytics?: AnalyticsData;
    auth?: {
        user?: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
    };
}

export interface RoleColor {
    fill: string;
    gradient: string[];
    shadow: string;
}

export interface RoleColorMap {
    [key: string]: RoleColor;
}

export interface RoleDataItem {
    name: string;
    value: number;
    color: string;
    gradientStart: string;
    gradientEnd: string;
    shadow: string;
}

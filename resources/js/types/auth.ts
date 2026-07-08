export type Role = {
    id: number;
    name: string;
    permissions: string[];
    default_empleado: boolean;
    users_count?: number;
    permissions_count?: number;
    [key: string]: unknown;
};

export type RoleSummary = {
    id?: number;
    name: string;
    [key: string]: unknown;
};

export type User = {
    id: number;
    name: string;
    username: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;

    // Spatie Permission
    roles?: RoleSummary[];

    [key: string]: unknown;
};

export type Auth = {
    user: User;
    permissions?: string[];
    roles?: string[];
};

export type TwoFactorSetupData = {
    svg: string;
    url: string;
};

export type TwoFactorSecretKey = {
    secretKey: string;
};

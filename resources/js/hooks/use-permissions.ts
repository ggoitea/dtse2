import { usePage } from '@inertiajs/react';

/**
 * Hook to check user permissions and roles in components.
 */
export function usePermissions() {
    const { auth } = usePage().props;
    /**
     * Check if the user has a specific permission.
     * Owners have all permissions.
     */
    const can = (permission: string): boolean => {
        return auth.permissions?.includes(permission) ?? false;
    };

    /**
     * Check if the user has any of the given permissions.
     */
    const canAny = (permissions: string[]): boolean => {
        return permissions.some((permission) => can(permission));
    };

    /**
     * Check if the user has all of the given permissions.
     */
    const canAll = (permissions: string[]): boolean => {
        return permissions.every((permission) => can(permission));
    };

    /**
     * Check if the user has a specific role.
     */
    const hasRole = (role: string): boolean => {
        return auth.roles?.includes(role) ?? false;
    };

    /**
     * Check if the user has any of the given roles.
     */
    const hasAnyRole = (roles: string[]): boolean => {
        return roles.some((role) => hasRole(role));
    };

    /**
     * Check if the user is an owner (of their tenant).
     */
    const isOwner = (): boolean => {
        return hasRole('owner');
    };

    return {
        can,
        canAny,
        canAll,
        hasRole,
        hasAnyRole,
        isOwner,
        permissions: auth.permissions ?? [],
        roles: auth.roles ?? [],
    };
}

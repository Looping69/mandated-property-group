import { useUser } from '../contexts/AuthContext';
import { UserRole } from '../types';

export interface UserRoleData {
    role: UserRole | null;
    isLoaded: boolean;
    isSignedIn: boolean;
    hasRole: boolean;
}

export function useUserRole(): UserRoleData {
    const { user, isLoaded, isSignedIn } = useUser();

    if (!isLoaded) {
        return {
            role: null,
            isLoaded: false,
            isSignedIn: false,
            hasRole: false,
        };
    }

    if (!isSignedIn || !user) {
        return {
            role: null,
            isLoaded: true,
            isSignedIn: false,
            hasRole: false,
        };
    }

    const role = user.role;

    return {
        role: role || null,
        isLoaded: true,
        isSignedIn: true,
        hasRole: !!role,
    };
}

/**
 * Helper to check if user has a specific role
 */
export function useHasRole(requiredRole: UserRole | UserRole[]): boolean {
    const { role, isSignedIn, hasRole } = useUserRole();

    if (!isSignedIn || !hasRole || !role) {
        return false;
    }

    if (Array.isArray(requiredRole)) {
        return requiredRole.includes(role);
    }

    return role === requiredRole;
}

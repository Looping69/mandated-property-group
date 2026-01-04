/**
 * useUserRole Hook
 * 
 * Provides access to the current user's role (AGENT, AGENCY, or CONTRACTOR)
 * stored in Clerk's user metadata.
 * 
 * Roles are set during registration via the Join Network flow.
 */

import { useUser } from '@clerk/clerk-react';
import { UserRole } from '../types';

export interface UserRoleData {
    role: UserRole | null;
    isLoaded: boolean;
    isSignedIn: boolean;
    hasRole: boolean;
    // Registration data stored during signup
    registrationData?: Record<string, unknown>;
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

    // Role is stored in unsafeMetadata during signup (frontend-settable)
    // A backend webhook should promote this to publicMetadata for security
    const metadata = user.unsafeMetadata as Record<string, unknown> || {};
    const publicMeta = user.publicMetadata as Record<string, unknown> || {};

    // Prefer publicMetadata (backend-set) over unsafeMetadata (frontend-set)
    const role = (publicMeta.role || metadata.role) as UserRole | undefined;
    const registrationData = (publicMeta.registrationData || metadata.registrationData) as Record<string, unknown> | undefined;

    return {
        role: role || null,
        isLoaded: true,
        isSignedIn: true,
        hasRole: !!role,
        registrationData,
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

import { useState, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { userService, User } from '../services/userService';

// Extended User type including helper flags
interface BackendUserData {
    user: User | null;
    isLoading: boolean;
    error: Error | null;
    isVerified: boolean; // Helper from backend user profile
    hasProfile: boolean; // Helper: true if user exists in backend
    refreshUser: () => Promise<void>;
}

export function useBackendUser(): BackendUserData {
    const { user: clerkUser, isLoaded, isSignedIn } = useUser();
    const { getToken } = useAuth();
    const [backendUser, setBackendUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchBackendUser = async () => {
        if (!isLoaded) return;
        if (!isSignedIn || !clerkUser) {
            setBackendUser(null);
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            setError(null);
            const token = await getToken();
            const user = await userService.getByClerkId(clerkUser.id, token || undefined);
            setBackendUser(user);
        } catch (err) {
            console.error('Failed to fetch backend user:', err);
            setError(err instanceof Error ? err : new Error('Unknown error'));
            setBackendUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBackendUser();
    }, [clerkUser?.id, isLoaded, isSignedIn, getToken]);

    return {
        user: backendUser,
        isLoading: isLoading || !isLoaded, // Global loading state
        error,
        isVerified: backendUser?.isVerified ?? false,
        hasProfile: !!backendUser,
        refreshUser: fetchBackendUser
    };
}

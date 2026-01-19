import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User } from '../types';

interface BackendUserData {
    user: User | null;
    isLoading: boolean;
    error: Error | null;
    isVerified: boolean;
    hasProfile: boolean;
    refreshUser: () => Promise<void>;
}

/**
 * Hook to access the current authenticated user from the backend
 */
export function useBackendUser(): BackendUserData {
    const { user, isLoaded, refreshUser: authRefresh } = useAuth();
    const [isLoading, setIsLoading] = useState(!isLoaded);

    useEffect(() => {
        setIsLoading(!isLoaded);
    }, [isLoaded]);

    const refreshUser = useCallback(async () => {
        setIsLoading(true);
        try {
            await authRefresh();
        } finally {
            setIsLoading(false);
        }
    }, [authRefresh]);

    return {
        user,
        isLoading,
        error: null,
        isVerified: user?.isVerified ?? false,
        hasProfile: !!user,
        refreshUser,
    };
}

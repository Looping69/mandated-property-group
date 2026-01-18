import { useState, useEffect } from 'react';
import { useUser, useAuth } from '../contexts/AuthContext';
import { User } from '../types';

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
    const { user, isLoaded, isSignedIn } = useUser();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isLoaded) {
            setIsLoading(false);
        }
    }, [isLoaded]);

    const refreshUser = async () => {
        // In our domestic auth system, the user is already in the context
        // But we could trigger a refresh logic if needed.
    };

    return {
        user: user,
        isLoading: isLoading,
        error: null,
        isVerified: user?.isVerified ?? false,
        hasProfile: !!user,
        refreshUser
    };
}

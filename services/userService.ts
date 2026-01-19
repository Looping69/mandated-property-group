import { apiRequest, getAuthToken } from './apiConfig';
import { User, UserRole } from '../types';

// ============================================================================
// TYPES
// ============================================================================

export interface SignupParams {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    phone?: string;
    imageUrl?: string;
    agentId?: string;
    contractorId?: string;
    agencyId?: string;
}

export interface LoginParams {
    email: string;
    password: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}

export interface UpdateUserParams {
    firstName?: string;
    lastName?: string;
    phone?: string;
    imageUrl?: string;
    isVerified?: boolean;
    isActive?: boolean;
    agentId?: string;
    contractorId?: string;
    agencyId?: string;
}

// ============================================================================
// AUTH SERVICE
// ============================================================================

export const userService = {
    /**
     * Sign up a new user
     */
    async signup(params: SignupParams): Promise<AuthResponse> {
        return apiRequest<AuthResponse>('/api/auth/signup', {
            method: 'POST',
            body: JSON.stringify(params),
        });
    },

    /**
     * Log in an existing user
     */
    async login(params: LoginParams): Promise<AuthResponse> {
        return apiRequest<AuthResponse>('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify(params),
        });
    },

    /**
     * Validate current session and get user
     */
    async getCurrentUser(): Promise<User | null> {
        const token = getAuthToken();
        if (!token) return null;

        try {
            const response = await apiRequest<{ user: User | null }>('/api/auth/me', {
                method: 'POST',
                body: JSON.stringify({ token }),
            });
            return response.user;
        } catch {
            return null;
        }
    },

    /**
     * Log out current user
     */
    async logout(): Promise<void> {
        const token = getAuthToken();
        if (token) {
            try {
                await apiRequest('/api/auth/logout', {
                    method: 'POST',
                    body: JSON.stringify({ token }),
                });
            } catch {
                // Ignore errors on logout
            }
        }
    },

    // ========================================================================
    // USER MANAGEMENT
    // ========================================================================

    /**
     * Get user by ID
     */
    async getById(id: string): Promise<User | null> {
        const response = await apiRequest<{ user: User | null }>(`/api/users/${id}`);
        return response.user;
    },

    /**
     * Get user by email
     */
    async getByEmail(email: string): Promise<User | null> {
        const response = await apiRequest<{ user: User | null }>(`/api/users/email/${encodeURIComponent(email)}`);
        return response.user;
    },

    /**
     * Update user profile
     */
    async update(id: string, updates: UpdateUserParams): Promise<{ success: boolean }> {
        return apiRequest<{ success: boolean }>(`/api/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updates),
        });
    },

    /**
     * List all users
     */
    async list(): Promise<User[]> {
        const response = await apiRequest<{ users: User[] }>('/api/users');
        return response.users || [];
    },

    /**
     * Get users by role
     */
    async getByRole(role: UserRole): Promise<User[]> {
        const response = await apiRequest<{ users: User[] }>(`/api/users/role/${role}`);
        return response.users || [];
    },
};

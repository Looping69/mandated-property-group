import { apiRequest } from './apiConfig';
import { User, UserRole } from '../types';

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

// Response types matching Encore backend
interface UserResponse {
    user?: User;
}

interface UsersListResponse {
    users: User[];
}

interface SuccessResponse {
    success: boolean;
}

// --- Service ---

export const userService = {
    // Get user by ID
    async getById(id: string): Promise<User | null> {
        const response = await apiRequest<UserResponse>(`/api/users/${id}`);
        return response.user || null;
    },

    // Get user by email
    async getByEmail(email: string): Promise<User | null> {
        const response = await apiRequest<UserResponse>(`/api/users/email/${encodeURIComponent(email)}`);
        return response.user || null;
    },

    // Signup new user
    async signup(params: any): Promise<{ user: User; token: string }> {
        return apiRequest<{ user: User; token: string }>('/api/auth/signup', {
            method: 'POST',
            body: JSON.stringify(params),
        });
    },

    // Login user
    async login(params: any): Promise<{ user: User; token: string }> {
        return apiRequest<{ user: User; token: string }>('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify(params),
        });
    },

    // Logout user
    async logout(): Promise<void> {
        return apiRequest<void>('/api/auth/logout', {
            method: 'POST',
        });
    },

    // Update user profile
    async update(id: string, updates: UpdateUserParams): Promise<SuccessResponse> {
        return apiRequest<SuccessResponse>(`/api/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updates),
        });
    },

    // Get all users (admin only)
    async list(): Promise<User[]> {
        const response = await apiRequest<UsersListResponse>('/api/users');
        return response.users || [];
    },

    // Get users by role
    async getByRole(role: UserRole): Promise<User[]> {
        const response = await apiRequest<UsersListResponse>(`/api/users/role/${role}`);
        return response.users || [];
    },
};

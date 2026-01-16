import { apiRequest } from './apiConfig';

// --- Types ---

export type UserRole = 'AGENT' | 'AGENCY' | 'CONTRACTOR';

export interface User {
    id: string;
    clerkId: string;
    email: string;
    role: UserRole;
    firstName?: string;
    lastName?: string;
    phone?: string;
    imageUrl?: string;
    agentId?: string;
    contractorId?: string;
    isVerified: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateUserParams {
    clerkId: string;
    email: string;
    role: UserRole;
    firstName?: string;
    lastName?: string;
    phone?: string;
    imageUrl?: string;
    agentId?: string;
    contractorId?: string;
}

export interface UpdateUserParams {
    firstName?: string;
    lastName?: string;
    phone?: string;
    imageUrl?: string;
    isVerified?: boolean;
    isActive?: boolean;
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
    // Get user by Clerk ID (typically called after sign-in)
    async getByClerkId(clerkId: string, token?: string): Promise<User | null> {
        const response = await apiRequest<UserResponse>(`/api/users/clerk/${clerkId}`, {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        return response.user || null;
    },

    // Get user by email
    async getByEmail(email: string): Promise<User | null> {
        const response = await apiRequest<UserResponse>(`/api/users/email/${encodeURIComponent(email)}`);
        return response.user || null;
    },

    // Create user (called after Clerk signup to sync user data)
    async create(params: CreateUserParams, token?: string): Promise<User> {
        return apiRequest<User>('/api/users', {
            method: 'POST',
            headers: token ? { 'Authorization': `Bearer ${token}` } : {},
            body: JSON.stringify(params),
        });
    },

    // Update user profile
    async update(id: string, updates: UpdateUserParams, token?: string): Promise<SuccessResponse> {
        return apiRequest<SuccessResponse>(`/api/users/${id}`, {
            method: 'PUT',
            headers: token ? { 'Authorization': `Bearer ${token}` } : {},
            body: JSON.stringify(updates),
        });
    },

    // Get all users (admin only)
    async list(token?: string): Promise<User[]> {
        const response = await apiRequest<UsersListResponse>('/api/users', {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        return response.users || [];
    },

    // Get users by role
    async getByRole(role: UserRole, token?: string): Promise<User[]> {
        const response = await apiRequest<UsersListResponse>(`/api/users/role/${role}`, {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        return response.users || [];
    },

    // Sync user after Clerk signup - creates or updates backend record with role data
    async syncFromClerk(params: {
        clerkId: string;
        email: string;
        role: UserRole;
        firstName?: string;
        lastName?: string;
        phone?: string;
        imageUrl?: string;
        agentId?: string;
        contractorId?: string;
    }, token?: string): Promise<User> {
        // The backend createUser endpoint now handles upserts using ON CONFLICT (clerk_id)
        return this.create(params, token);
    },
};

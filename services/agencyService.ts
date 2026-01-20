import { apiRequest } from './apiConfig';

// --- Types ---

export interface Agency {
    id: string;
    name: string;
    registrationNumber?: string;
    principalName?: string;
    officeAddress?: string;
    website?: string;
    phone?: string;
    email?: string;
    description?: string;
    logoUrl?: string;
    serviceAreas?: string;
    teamSize?: string;
    isFranchise: boolean;
    isVerified: boolean;
    createdAt: string;
    status?: string;
}

export interface CreateAgencyParams {
    name: string;
    registrationNumber?: string;
    principalName?: string;
    officeAddress?: string;
    website?: string;
    phone?: string;
    email?: string;
    description?: string;
    logoUrl?: string;
    serviceAreas?: string;
    teamSize?: string;
    isFranchise?: boolean;
}

export interface AgencyAgent {
    id: string;
    name: string;
    email: string;
    title?: string;
}

// Response types matching Encore backend
interface AgenciesListResponse {
    agencies: Agency[];
}

interface AgencyResponse {
    agency?: Agency;
}

interface AgencyAgentsResponse {
    agents: AgencyAgent[];
}

// --- Service ---

export const agencyService = {
    // List all agencies
    async list(token?: string): Promise<Agency[]> {
        const response = await apiRequest<AgenciesListResponse>('/api/agencies', {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        });
        return response.agencies || [];
    },

    // Get single agency by ID
    async getById(id: string): Promise<Agency | null> {
        const response = await apiRequest<AgencyResponse>(`/api/agencies/${id}`);
        return response.agency || null;
    },

    // Create a new agency
    async create(params: CreateAgencyParams, token?: string): Promise<Agency> {
        return apiRequest<Agency>('/api/agencies', {
            method: 'POST',
            headers: token ? { 'Authorization': `Bearer ${token}` } : {},
            body: JSON.stringify(params),
        });
    },

    // Delete an agency
    async delete(id: string, token?: string): Promise<void> {
        return apiRequest<void>(`/api/agencies/${id}`, {
            method: 'DELETE',
            headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        });
    },

    // Get agents belonging to an agency
    async getAgents(agencyId: string, token?: string): Promise<AgencyAgent[]> {
        const response = await apiRequest<AgencyAgentsResponse>(`/api/agencies/${agencyId}/agents`, {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        });
        return response.agents || [];
    },

    // Update agency status (suspend/activate)
    async updateStatus(id: string, status: string, token?: string): Promise<{ success: boolean }> {
        return apiRequest<{ success: boolean }>(`/api/agencies/${id}/status`, {
            method: 'PUT',
            headers: token ? { 'Authorization': `Bearer ${token}` } : {},
            body: JSON.stringify({ id, status }),
        });
    },
};

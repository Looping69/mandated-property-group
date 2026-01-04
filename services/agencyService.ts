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
    async list(): Promise<Agency[]> {
        const response = await apiRequest<AgenciesListResponse>('/agencies');
        return response.agencies || [];
    },

    // Get single agency by ID
    async getById(id: string): Promise<Agency | null> {
        const response = await apiRequest<AgencyResponse>(`/agencies/${id}`);
        return response.agency || null;
    },

    // Create a new agency
    async create(params: CreateAgencyParams): Promise<Agency> {
        return apiRequest<Agency>('/agencies', {
            method: 'POST',
            body: JSON.stringify(params),
        });
    },

    // Delete an agency
    async delete(id: string): Promise<void> {
        return apiRequest<void>(`/agencies/${id}`, {
            method: 'DELETE',
        });
    },

    // Get agents belonging to an agency
    async getAgents(agencyId: string): Promise<AgencyAgent[]> {
        const response = await apiRequest<AgencyAgentsResponse>(`/agencies/${agencyId}/agents`);
        return response.agents || [];
    },
};

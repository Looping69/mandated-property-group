import { apiRequest } from './apiConfig';
import { Agent } from '../types';

// Extended Agent type for registration with all backend fields
export interface ExtendedAgent extends Agent {
    bio?: string;
    areas?: string;
    ppraNumber?: string;
    agency?: string;
    agencyId?: string;
    isVerified?: boolean;
    status: 'active' | 'suspended';
}

export interface CreateAgentParams {
    name: string;
    email: string;
    phone: string;
    title?: string;
    image?: string;
    sales?: string;
    bio?: string;
    areas?: string;
    ppraNumber?: string;
    agency?: string;
    agencyId?: string;
}

// Response types matching Encore backend
interface AgentsListResponse {
    agents: Agent[];
}

export const agentService = {
    // List all agents
    async list(token?: string): Promise<Agent[]> {
        const response = await apiRequest<AgentsListResponse>('/api/agents', {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        });
        return response.agents || [];
    },

    // Create a new agent
    async create(params: CreateAgentParams, token?: string): Promise<Agent> {
        return apiRequest<Agent>('/api/agents', {
            method: 'POST',
            headers: token ? { 'Authorization': `Bearer ${token}` } : {},
            body: JSON.stringify(params),
        });
    },

    // Delete an agent
    async delete(id: string, token?: string): Promise<void> {
        return apiRequest<void>(`/api/agents/${id}`, {
            method: 'DELETE',
            headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        });
    },

    // Update agent status (suspend/activate)
    async updateStatus(id: string, status: string, token?: string): Promise<{ success: boolean }> {
        return apiRequest<{ success: boolean }>(`/api/agents/${id}/status`, {
            method: 'PUT',
            headers: token ? { 'Authorization': `Bearer ${token}` } : {},
            body: JSON.stringify({ id, status }),
        });
    },

    // Get agent by ID
    async getById(id: string): Promise<Agent | null> {
        try {
            const response = await apiRequest<{ agent?: Agent }>(`/agents/${id}`);
            return response.agent || null;
        } catch {
            // Fallback: filter from list if single endpoint not available
            const agents = await this.list();
            return agents.find(a => a.id === id) || null;
        }
    },
};

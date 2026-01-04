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
    async list(): Promise<Agent[]> {
        const response = await apiRequest<AgentsListResponse>('/agents');
        return response.agents || [];
    },

    // Create a new agent
    async create(data: CreateAgentParams): Promise<Agent> {
        return apiRequest<Agent>('/agents', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    // Delete an agent
    async delete(id: string): Promise<void> {
        return apiRequest<void>(`/agents/${id}`, {
            method: 'DELETE',
        });
    },

    // Get agent by ID (if backend supports it)
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


import { apiRequest } from './apiConfig';
import { Agent } from '../types';

export const agentService = {
    list: () => apiRequest<{ agents: Agent[] }>('/agents'),
    create: (data: Omit<Agent, 'id'>) => apiRequest<Agent>('/agents', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    delete: (id: string) => apiRequest<void>(`/agents/${id}`, {
        method: 'DELETE',
    }),
};

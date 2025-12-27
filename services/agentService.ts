
import { apiRequest } from './apiConfig';
import { Agent } from '../types';

export const agentService = {
    list: () => apiRequest<{ agents: Agent[] }>('/agents'),
};

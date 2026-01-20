import { apiRequest } from './apiConfig';
import { Contractor } from '../types';

// Extended contractor params for registration
export interface ExtendedContractor extends Contractor {
    status?: string;
}

// ... existing CreateContractorParams ...

// ... existing ContractorsListResponse ...

export const contractorService = {
    // List all contractors
    async list(token?: string): Promise<Contractor[]> {
        const response = await apiRequest<ContractorsListResponse>('/api/contractors', {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        });
        return response.contractors || [];
    },

    // ... existing create, delete, getById ...
    async create(data: CreateContractorParams, token?: string): Promise<Contractor> {
        return apiRequest<Contractor>('/api/contractors', {
            method: 'POST',
            headers: token ? { 'Authorization': `Bearer ${token}` } : {},
            body: JSON.stringify({
                name: data.name,
                trade: data.trade,
                location: data.location,
                phone: data.phone || '',
                email: data.email || '',
                description: data.description || '',
                image: data.image || '',
                rating: data.rating || 0,
                hourlyRate: data.hourlyRate || 0,
                isVerified: data.isVerified || false,
            }),
        });
    },

    async delete(id: string, token?: string): Promise<void> {
        return apiRequest<void>(`/api/contractors/${id}`, {
            method: 'DELETE',
            headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        });
    },

    async getById(id: string): Promise<Contractor | null> {
        try {
            const contractors = await this.list();
            return contractors.find(c => c.id === id) || null;
        } catch {
            return null;
        }
    },

    // ... existing getByTrade, getByLocation ...
    async getByTrade(trade: string): Promise<Contractor[]> {
        const contractors = await this.list();
        return contractors.filter(c =>
            c.trade.toLowerCase().includes(trade.toLowerCase())
        );
    },

    async getByLocation(location: string): Promise<Contractor[]> {
        const contractors = await this.list();
        return contractors.filter(c =>
            c.location.toLowerCase().includes(location.toLowerCase())
        );
    },

    // Update contractor status (suspend/activate)
    async updateStatus(id: string, status: string, token?: string): Promise<{ success: boolean }> {
        return apiRequest<{ success: boolean }>(`/api/contractors/${id}/status`, {
            method: 'PUT',
            headers: token ? { 'Authorization': `Bearer ${token}` } : {},
            body: JSON.stringify({ id, status }),
        });
    },
};

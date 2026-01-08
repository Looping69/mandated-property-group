import { apiRequest } from './apiConfig';
import { Conveyancer } from '../types';

// Response types matching Encore backend
interface ConveyancersListResponse {
    conveyancers: Conveyancer[];
}

export interface CreateConveyancerParams {
    name: string;
    specialist: string;
    location: string;
    rating?: number;
    image?: string;
    website?: string;
    phone?: string;
    isVerified?: boolean;
}

export const conveyancerService = {
    // List all conveyancers
    async list(token?: string): Promise<Conveyancer[]> {
        const response = await apiRequest<ConveyancersListResponse>('/api/conveyancers', {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        });
        return response.conveyancers || [];
    },

    // Create a new conveyancer
    async create(data: CreateConveyancerParams, token?: string): Promise<Conveyancer> {
        return apiRequest<Conveyancer>('/api/conveyancers', {
            method: 'POST',
            headers: token ? { 'Authorization': `Bearer ${token}` } : {},
            body: JSON.stringify({
                name: data.name,
                specialist: data.specialist,
                location: data.location,
                rating: data.rating || 0,
                image: data.image || '',
                website: data.website || '',
                phone: data.phone || '',
                isVerified: data.isVerified || false,
            }),
        });
    },

    // Delete a conveyancer
    async delete(id: string, token?: string): Promise<void> {
        return apiRequest<void>(`/api/conveyancers/${id}`, {
            method: 'DELETE',
            headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        });
    },

    // Get conveyancer by ID
    async getById(id: string): Promise<Conveyancer | null> {
        try {
            const conveyancers = await this.list();
            return conveyancers.find(c => c.id === id) || null;
        } catch {
            return null;
        }
    },

    // Get conveyancers by location
    async getByLocation(location: string): Promise<Conveyancer[]> {
        const conveyancers = await this.list();
        return conveyancers.filter(c =>
            c.location.toLowerCase().includes(location.toLowerCase())
        );
    },

    // Get conveyancers by specialty
    async getBySpecialty(specialist: string): Promise<Conveyancer[]> {
        const conveyancers = await this.list();
        return conveyancers.filter(c =>
            c.specialist.toLowerCase().includes(specialist.toLowerCase())
        );
    },
};

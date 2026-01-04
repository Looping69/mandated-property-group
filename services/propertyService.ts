import { apiRequest } from './apiConfig';
import { Listing } from '../types';

// Response types matching Encore backend
interface ListingsListResponse {
    listings: Listing[];
}

export const propertyService = {
    // List all properties
    async list(): Promise<Listing[]> {
        const response = await apiRequest<ListingsListResponse>('/properties');
        return response.listings || [];
    },

    // Create a new property listing
    async create(data: Omit<Listing, 'id'>): Promise<Listing> {
        return apiRequest<Listing>('/properties', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    // Update a property listing (if backend supports it)
    async update(id: string, data: Partial<Listing>): Promise<Listing> {
        return apiRequest<Listing>(`/properties/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    // Delete a property listing
    async delete(id: string): Promise<void> {
        return apiRequest<void>(`/properties/${id}`, {
            method: 'DELETE',
        });
    },

    // Get property by ID (filter from list if single endpoint not available)
    async getById(id: string): Promise<Listing | null> {
        try {
            const listings = await this.list();
            return listings.find(l => l.id === id) || null;
        } catch {
            return null;
        }
    },

    // Get featured properties
    async getFeatured(): Promise<Listing[]> {
        const listings = await this.list();
        return listings.filter(l => l.isFeatured);
    },

    // Get properties by agent
    async getByAgent(agentId: string): Promise<Listing[]> {
        const listings = await this.list();
        return listings.filter(l => l.agentId === agentId);
    },

    // Search properties
    async search(query: string): Promise<Listing[]> {
        const listings = await this.list();
        const lowerQuery = query.toLowerCase();
        return listings.filter(l =>
            l.title.toLowerCase().includes(lowerQuery) ||
            l.address.toLowerCase().includes(lowerQuery) ||
            l.description?.toLowerCase().includes(lowerQuery)
        );
    },
};

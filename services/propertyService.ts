import { apiRequest } from './apiConfig';
import { Listing } from '../types';

// Response types matching Encore backend
interface ListingsListResponse {
    listings: Listing[];
}

export const propertyService = {
    // List all listings
    async list(token?: string): Promise<Listing[]> {
        const response = await apiRequest<ListingsListResponse>('/api/properties', {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        });
        return response.listings || [];
    },

    // Create a new listing
    async create(listing: Partial<Listing>, token?: string): Promise<Listing> {
        return apiRequest<Listing>('/api/properties', {
            method: 'POST',
            headers: token ? { 'Authorization': `Bearer ${token}` } : {},
            body: JSON.stringify({
                ...listing,
                agentId: listing.agentId || 'a1',
                isFeatured: listing.isFeatured || false,
                status: listing.status || 'available',
                price: Number(listing.price),
            }),
        });
    },

    // Update a listing
    async update(id: string, updates: Partial<Listing>, token?: string): Promise<Listing> {
        return apiRequest<Listing>(`/api/properties/${id}`, {
            method: 'PUT',
            headers: token ? { 'Authorization': `Bearer ${token}` } : {},
            body: JSON.stringify(updates),
        });
    },

    // Delete a listing
    async delete(id: string, token?: string): Promise<void> {
        return apiRequest<void>(`/api/properties/${id}`, {
            method: 'DELETE',
            headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        });
    },

    // Get single listing
    async getById(id: string): Promise<Listing | null> {
        const listings = await this.list();
        return listings.find(l => l.id === id) || null;
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

import { apiRequest } from './apiConfig';
import { VirtualTour, TourStop } from '../types';

// Response types matching Encore backend
interface ToursListResponse {
    tours: VirtualTour[];
}

export interface CreateTourParams {
    title: string;
    agentId: string;
    listingId?: string;
    status?: string;
    voiceUri?: string;
}

export interface CreateTourStopParams {
    title: string;
    description: string;
    image: string;
    order: number;
}

export const tourService = {
    // List all tours
    async list(token?: string): Promise<VirtualTour[]> {
        const response = await apiRequest<ToursListResponse>('/api/tours', {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        });
        return response.tours || [];
    },

    // Create a new tour
    async create(data: CreateTourParams, token?: string): Promise<VirtualTour> {
        return apiRequest<VirtualTour>('/api/tours', {
            method: 'POST',
            headers: token ? { 'Authorization': `Bearer ${token}` } : {},
            body: JSON.stringify({
                title: data.title,
                agentId: data.agentId,
                listingId: data.listingId,
                status: data.status || 'draft',
                voiceUri: data.voiceUri,
            }),
        });
    },

    // Add a stop to a tour
    async addStop(tourId: string, stop: CreateTourStopParams, token?: string): Promise<TourStop> {
        return apiRequest<TourStop>(`/api/tours/${tourId}/stops`, {
            method: 'POST',
            headers: token ? { 'Authorization': `Bearer ${token}` } : {},
            body: JSON.stringify({ ...stop, tourId }),
        });
    },

    // Delete a tour
    async delete(id: string, token?: string): Promise<void> {
        return apiRequest<void>(`/api/tours/${id}`, {
            method: 'DELETE',
            headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        });
    },

    // Get tour by ID
    async getById(id: string): Promise<VirtualTour | null> {
        try {
            const tours = await this.list();
            return tours.find(t => t.id === id) || null;
        } catch {
            return null;
        }
    },

    // Get tours by agent
    async getByAgent(agentId: string): Promise<VirtualTour[]> {
        const tours = await this.list();
        return tours.filter(t => t.agentId === agentId);
    },

    // Get tours by listing
    async getByListing(listingId: string): Promise<VirtualTour[]> {
        const tours = await this.list();
        return tours.filter(t => t.listingId === listingId);
    },
};

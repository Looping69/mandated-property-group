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
    async list(): Promise<VirtualTour[]> {
        const response = await apiRequest<ToursListResponse>('/tours');
        return response.tours || [];
    },

    // Create a new tour
    async create(data: CreateTourParams): Promise<VirtualTour> {
        return apiRequest<VirtualTour>('/tours', {
            method: 'POST',
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
    async addStop(tourId: string, stop: CreateTourStopParams): Promise<TourStop> {
        return apiRequest<TourStop>(`/tours/${tourId}/stops`, {
            method: 'POST',
            body: JSON.stringify({ ...stop, tourId }),
        });
    },

    // Delete a tour
    async delete(id: string): Promise<void> {
        return apiRequest<void>(`/tours/${id}`, {
            method: 'DELETE',
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

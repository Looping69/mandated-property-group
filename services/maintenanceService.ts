import { apiRequest } from './apiConfig';
import { MaintenanceRequest } from '../types';

// Response types matching Encore backend
interface MaintenanceListResponse {
    requests: MaintenanceRequest[];
}

interface MaintenanceItemResponse {
    request?: MaintenanceRequest;
}

interface SuccessResponse {
    success: boolean;
}

export const maintenanceService = {
    // Get all maintenance requests
    async getAll(): Promise<MaintenanceRequest[]> {
        const response = await apiRequest<MaintenanceListResponse>('/api/maintenance');
        return response.requests || [];
    },

    // Get a specific maintenance request
    async getById(id: string): Promise<MaintenanceRequest | null> {
        const response = await apiRequest<MaintenanceItemResponse>(`/api/maintenance/${id}`);
        return response.request || null;
    },

    // Get maintenance requests for a specific contractor
    async getByContractor(contractorId: string): Promise<MaintenanceRequest[]> {
        const response = await apiRequest<MaintenanceListResponse>(`/api/maintenance/contractor/${contractorId}`);
        return response.requests || [];
    },

    // Get maintenance requests for a specific listing
    async getByListing(listingId: string): Promise<MaintenanceRequest[]> {
        const response = await apiRequest<MaintenanceListResponse>(`/api/maintenance/listing/${listingId}`);
        return response.requests || [];
    },

    // Create a new maintenance request
    async create(request: {
        listingId?: string;
        title: string;
        description: string;
        priority: 'low' | 'medium' | 'high' | 'urgent';
        category: string;
        reportedBy: string;
        images?: string[];
        estimatedCost?: number;
    }): Promise<MaintenanceRequest> {
        return apiRequest<MaintenanceRequest>('/api/maintenance', {
            method: 'POST',
            body: JSON.stringify(request),
        });
    },

    // Update a maintenance request
    async update(id: string, updates: {
        title?: string;
        description?: string;
        priority?: 'low' | 'medium' | 'high' | 'urgent';
        category?: string;
        estimatedCost?: number;
        actualCost?: number;
    }): Promise<SuccessResponse> {
        return apiRequest<SuccessResponse>(`/api/maintenance/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updates),
        });
    },

    // Delete a maintenance request
    async delete(id: string): Promise<void> {
        return apiRequest<void>(`/api/maintenance/${id}`, {
            method: 'DELETE',
        });
    },

    // Assign a maintenance request to a contractor
    async assign(id: string, contractorId: string): Promise<SuccessResponse> {
        return apiRequest<SuccessResponse>(`/api/maintenance/${id}/assign`, {
            method: 'POST',
            body: JSON.stringify({ contractorId }),
        });
    },

    // Update status of a maintenance request
    async updateStatus(id: string, status: MaintenanceRequest['status']): Promise<SuccessResponse> {
        return apiRequest<SuccessResponse>(`/api/maintenance/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status }),
        });
    },
};

import { apiRequest } from './apiConfig';
import { MaintenanceRequest } from '../types';

export const maintenanceService = {
    // Get all maintenance requests
    async getAll(): Promise<MaintenanceRequest[]> {
        return apiRequest<MaintenanceRequest[]>('/api/maintenance');
    },

    // Get a specific maintenance request
    async getById(id: string): Promise<MaintenanceRequest> {
        return apiRequest<MaintenanceRequest>(`/api/maintenance/${id}`);
    },

    // Get maintenance requests for a specific contractor
    async getByContractor(contractorId: string): Promise<MaintenanceRequest[]> {
        return apiRequest<MaintenanceRequest[]>(`/api/maintenance/contractor/${contractorId}`);
    },

    // Get maintenance requests for a specific listing
    async getByListing(listingId: string): Promise<MaintenanceRequest[]> {
        return apiRequest<MaintenanceRequest[]>(`/api/maintenance/listing/${listingId}`);
    },

    // Create a new maintenance request
    async create(request: Omit<MaintenanceRequest, 'id' | 'createdAt' | 'updatedAt'>): Promise<MaintenanceRequest> {
        return apiRequest<MaintenanceRequest>('/api/maintenance', {
            method: 'POST',
            body: JSON.stringify(request),
        });
    },

    // Update a maintenance request
    async update(id: string, updates: Partial<MaintenanceRequest>): Promise<MaintenanceRequest> {
        return apiRequest<MaintenanceRequest>(`/api/maintenance/${id}`, {
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
    async assign(id: string, contractorId: string): Promise<MaintenanceRequest> {
        return apiRequest<MaintenanceRequest>(`/api/maintenance/${id}/assign`, {
            method: 'POST',
            body: JSON.stringify({ contractorId }),
        });
    },

    // Update status of a maintenance request
    async updateStatus(id: string, status: MaintenanceRequest['status']): Promise<MaintenanceRequest> {
        return apiRequest<MaintenanceRequest>(`/api/maintenance/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status }),
        });
    },
};

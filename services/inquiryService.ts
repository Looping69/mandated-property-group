import { apiRequest } from './apiConfig';
import { Inquiry } from '../types';

// Response types matching Encore backend
interface InquiriesListResponse {
    inquiries: Inquiry[];
}

interface SuccessResponse {
    success: boolean;
}

export interface CreateInquiryParams {
    listingId?: string;
    agentId?: string;
    customerName: string;
    customerEmail: string;
    message: string;
}

export const inquiryService = {
    // List all inquiries
    async list(token?: string): Promise<Inquiry[]> {
        const response = await apiRequest<InquiriesListResponse>('/api/inquiries', {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        });
        return response.inquiries || [];
    },

    // Create a new inquiry
    async create(data: CreateInquiryParams, token?: string): Promise<Inquiry> {
        return apiRequest<Inquiry>('/api/inquiries', {
            method: 'POST',
            headers: token ? { 'Authorization': `Bearer ${token}` } : {},
            body: JSON.stringify(data),
        });
    },

    // Update inquiry status
    async updateStatus(id: string, status: string, token?: string): Promise<SuccessResponse> {
        return apiRequest<SuccessResponse>(`/api/inquiries/${id}/status`, {
            method: 'PUT',
            headers: token ? { 'Authorization': `Bearer ${token}` } : {},
            body: JSON.stringify({ id, status }),
        });
    },

    // Get inquiries by agent
    async getByAgent(agentId: string): Promise<Inquiry[]> {
        const inquiries = await this.list();
        return inquiries.filter(i => i.agentId === agentId);
    },

    // Get inquiries by listing
    async getByListing(listingId: string): Promise<Inquiry[]> {
        const inquiries = await this.list();
        return inquiries.filter(i => i.listingId === listingId);
    },

    // Get inquiries by status
    async getByStatus(status: string): Promise<Inquiry[]> {
        const inquiries = await this.list();
        return inquiries.filter(i => i.status === status);
    },
};

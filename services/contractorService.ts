import { apiRequest } from './apiConfig';
import { Contractor } from '../types';

// Extended contractor params for registration
export interface CreateContractorParams {
    name: string;
    trade: string;
    location: string;
    phone?: string;
    email?: string;
    description?: string;
    image?: string;
    rating?: number;
    hourlyRate?: number;
    isVerified?: boolean;
    // Additional registration fields
    yearsExperience?: string;
    certifications?: string;
    emergencyService?: boolean;
    insurance?: boolean;
    license?: string;
}

// Response types matching Encore backend
interface ContractorsListResponse {
    contractors: Contractor[];
}

export const contractorService = {
    // List all contractors
    async list(): Promise<Contractor[]> {
        const response = await apiRequest<ContractorsListResponse>('/contractors');
        return response.contractors || [];
    },

    // Create a new contractor
    async create(data: CreateContractorParams): Promise<Contractor> {
        return apiRequest<Contractor>('/contractors', {
            method: 'POST',
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

    // Delete a contractor
    async delete(id: string): Promise<void> {
        return apiRequest<void>(`/contractors/${id}`, {
            method: 'DELETE',
        });
    },

    // Get contractor by ID (filter from list if single endpoint not available)
    async getById(id: string): Promise<Contractor | null> {
        try {
            const contractors = await this.list();
            return contractors.find(c => c.id === id) || null;
        } catch {
            return null;
        }
    },

    // Get contractors by trade
    async getByTrade(trade: string): Promise<Contractor[]> {
        const contractors = await this.list();
        return contractors.filter(c =>
            c.trade.toLowerCase().includes(trade.toLowerCase())
        );
    },

    // Get contractors by location
    async getByLocation(location: string): Promise<Contractor[]> {
        const contractors = await this.list();
        return contractors.filter(c =>
            c.location.toLowerCase().includes(location.toLowerCase())
        );
    },
};

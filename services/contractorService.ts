import { apiRequest } from './apiConfig';
import { Contractor } from '../types';

export const contractorService = {
    list: () => apiRequest<{ contractors: Contractor[] }>('/contractors'),

    create: (data: Omit<Contractor, 'id'>) =>
        apiRequest<Contractor>('/contractors', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    delete: (id: string) =>
        apiRequest<void>(`/contractors/${id}`, {
            method: 'DELETE',
        }),
};

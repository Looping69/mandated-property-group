
import { apiRequest } from './apiConfig';
import { Listing } from '../types';

export const propertyService = {
    list: () => apiRequest<{ listings: Listing[] }>('/properties'),
    create: (data: Omit<Listing, 'id'>) => apiRequest<Listing>('/properties', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    update: (id: string, data: Partial<Listing>) => apiRequest<Listing>(`/properties/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    delete: (id: string) => apiRequest<void>(`/properties/${id}`, {
        method: 'DELETE',
    }),
};

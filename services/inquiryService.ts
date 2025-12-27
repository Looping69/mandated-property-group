
import { apiRequest } from './apiConfig';
import { Inquiry } from '../types';

export const inquiryService = {
    list: () => apiRequest<{ inquiries: Inquiry[] }>('/inquiries'),
    create: (data: Omit<Inquiry, 'id' | 'date' | 'status'>) => apiRequest<Inquiry>('/inquiries', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    updateStatus: (id: string, status: string) =>
        apiRequest<{ success: boolean }>(`/inquiries/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ id, status }),
        }),
};

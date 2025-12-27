import { apiRequest } from './apiConfig';
import { VirtualTour, TourStop } from '../types';

export const tourService = {
    list: () => apiRequest<{ tours: VirtualTour[] }>('/tours'),

    create: (data: { title: string; agentId: string; listingId?: string; status: string; voiceUri?: string }) =>
        apiRequest<VirtualTour>('/tours', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    addStop: (tourId: string, stop: { title: string; description: string; image: string; order: number }) =>
        apiRequest<TourStop>(`/tours/${tourId}/stops`, {
            method: 'POST',
            body: JSON.stringify({ ...stop, tourId }),
        }),

    delete: (id: string) =>
        apiRequest<void>(`/tours/${id}`, {
            method: 'DELETE',
        }),
};

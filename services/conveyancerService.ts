import { apiRequest } from './apiConfig';
import { Conveyancer } from '../types';

export const conveyancerService = {
    list: () => apiRequest<{ conveyancers: Conveyancer[] }>('/conveyancers'),

    create: (data: Omit<Conveyancer, 'id'>) =>
        apiRequest<Conveyancer>('/conveyancers', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    delete: (id: string) =>
        apiRequest<void>(`/conveyancers/${id}`, {
            method: 'DELETE',
        }),
};

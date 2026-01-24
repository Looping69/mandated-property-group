import { apiRequest, getAuthToken } from './apiConfig';

// --- Types ---

export interface Package {
    id: string;
    name: string;
    slug: string;
    description: string;
    priceCents: number;
    billingPeriod: 'monthly' | 'once';
    maxListings: number;
    topAgents: number;
    featuredListings: number;
    maxPhotos: number;
    isActive: boolean;
}

export interface Subscription {
    id: string;
    userId: string;
    packageId: string;
    status: 'pending' | 'active' | 'cancelled' | 'expired';
    currentPeriodStart?: string;
    currentPeriodEnd?: string;
    createdAt: string;
    updatedAt: string;
    package?: Package;
}

// --- Service ---

export const subscriptionService = {
    // List all packages
    async listPackages(): Promise<Package[]> {
        const response = await apiRequest<{ packages: Package[] }>('/api/packages');
        return response.packages || [];
    },

    // Get single package
    async getPackage(slug: string): Promise<Package | null> {
        const response = await apiRequest<{ package?: Package }>(`/api/packages/${slug}`);
        return response.package || null;
    },

    // Create checkout session
    async createCheckout(packageId: string, successUrl: string, cancelUrl: string): Promise<{ checkoutUrl: string; paymentId: string }> {
        const token = getAuthToken();
        return apiRequest<{ checkoutUrl: string; paymentId: string }>('/api/subscriptions/checkout', {
            method: 'POST',
            headers: token ? { 'Authorization': `Bearer ${token}` } : {},
            body: JSON.stringify({ packageId, successUrl, cancelUrl, authorization: token ? `Bearer ${token}` : '' }),
        });
    },

    // Verify payment and get subscription
    async verifyPayment(paymentId: string): Promise<{ success: boolean; subscription?: Subscription }> {
        const token = getAuthToken();
        return apiRequest<{ success: boolean; subscription?: Subscription }>('/api/subscriptions/verify', {
            method: 'POST',
            headers: token ? { 'Authorization': `Bearer ${token}` } : {},
            body: JSON.stringify({ paymentId, authorization: token ? `Bearer ${token}` : '' }),
        });
    },

    // Get current subscription
    async getMySubscription(): Promise<Subscription | null> {
        const token = getAuthToken();
        const response = await apiRequest<{ subscription?: Subscription }>('/api/subscriptions/me', {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        });
        return response.subscription || null;
    },

    // Format price for display
    formatPrice(priceCents: number): string {
        return `R${(priceCents / 100).toFixed(0)}`;
    },
};

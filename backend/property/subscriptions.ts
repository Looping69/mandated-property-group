import { api, APIError, Header } from "encore.dev/api";
import { db } from "./property";
import { secret } from "encore.dev/config";

// Yoco API configuration
const YOCO_SECRET_KEY = secret("YOCO_SECRET_KEY");
const YOCO_API_URL = "https://payments.yoco.com/api/checkouts";

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
}

export interface Payment {
    id: string;
    userId: string;
    subscriptionId?: string;
    yocoCheckoutId?: string;
    amountCents: number;
    currency: string;
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    description?: string;
    createdAt: string;
}

// --- API Endpoints ---

// List all packages
export const listPackages = api(
    { expose: true, method: "GET", path: "/api/packages" },
    async (): Promise<{ packages: Package[] }> => {
        const packages: Package[] = [];
        const rows = db.query`
            SELECT id, name, slug, description, price_cents as "priceCents", 
                   billing_period as "billingPeriod", max_listings as "maxListings",
                   top_agents as "topAgents", featured_listings as "featuredListings",
                   max_photos as "maxPhotos",
                   is_active as "isActive"
            FROM packages
            WHERE is_active = true
            ORDER BY price_cents ASC
        `;
        for await (const row of rows) {
            packages.push({
                id: row.id,
                name: row.name,
                slug: row.slug,
                description: row.description,
                priceCents: row.priceCents,
                billingPeriod: row.billingPeriod,
                maxListings: row.maxListings,
                topAgents: row.topAgents,
                featuredListings: row.featuredListings,
                maxPhotos: row.maxPhotos,
                isActive: row.isActive,
            });
        }
        return { packages };
    }
);

// Get single package
export const getPackage = api(
    { expose: true, method: "GET", path: "/api/packages/:slug" },
    async ({ slug }: { slug: string }): Promise<{ package?: Package }> => {
        const row = await db.queryRow`
            SELECT id, name, slug, description, price_cents as "priceCents", 
                   billing_period as "billingPeriod", max_listings as "maxListings",
                   top_agents as "topAgents", featured_listings as "featuredListings",
                   max_photos as "maxPhotos",
                   is_active as "isActive"
            FROM packages
            WHERE slug = ${slug}
        `;
        if (!row) return {};
        return {
            package: {
                id: row.id,
                name: row.name,
                slug: row.slug,
                description: row.description,
                priceCents: row.priceCents,
                billingPeriod: row.billingPeriod,
                maxListings: row.maxListings,
                topAgents: row.topAgents,
                featuredListings: row.featuredListings,
                maxPhotos: row.maxPhotos,
                isActive: row.isActive,
            }
        };
    }
);

// Create Yoco checkout for a package
export const createCheckout = api(
    { expose: true, auth: true, method: "POST", path: "/api/subscriptions/checkout" },
    async (params: { packageId: string; successUrl: string; cancelUrl: string; authorization: Header<"Authorization"> }): Promise<{ checkoutUrl: string; paymentId: string }> => {
        // Get user from session
        const token = params.authorization.replace("Bearer ", "");
        const session = await db.queryRow`
            SELECT user_id as "userId" FROM sessions WHERE token = ${token} AND expires_at > NOW()
        `;
        if (!session) throw APIError.unauthenticated("invalid session");

        // Get package details
        const pkg = await db.queryRow`
            SELECT id, name, price_cents as "priceCents", billing_period as "billingPeriod"
            FROM packages WHERE id = ${params.packageId} AND is_active = true
        `;
        if (!pkg) throw APIError.notFound("package not found");

        // Create payment record
        const paymentId = `pay_${Math.random().toString(36).substring(2, 11)}${Date.now().toString(36)}`;
        await db.exec`
            INSERT INTO payments (id, user_id, amount_cents, currency, status, description)
            VALUES (${paymentId}, ${session.userId}, ${pkg.priceCents}, 'ZAR', 'pending', ${pkg.name})
        `;

        // Create Yoco checkout
        const yocoResponse = await fetch(YOCO_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${YOCO_SECRET_KEY()}`,
            },
            body: JSON.stringify({
                amount: pkg.priceCents,
                currency: "ZAR",
                successUrl: `${params.successUrl}?paymentId=${paymentId}`,
                cancelUrl: params.cancelUrl,
                metadata: {
                    paymentId,
                    packageId: params.packageId,
                    userId: session.userId,
                },
            }),
        });

        if (!yocoResponse.ok) {
            const error = await yocoResponse.text();
            console.error("Yoco checkout error:", error);
            throw APIError.internal("failed to create checkout");
        }

        const checkout = await yocoResponse.json() as { id: string; redirectUrl: string };

        // Update payment with Yoco checkout ID
        await db.exec`
            UPDATE payments SET yoco_checkout_id = ${checkout.id} WHERE id = ${paymentId}
        `;

        return { checkoutUrl: checkout.redirectUrl, paymentId };
    }
);

// Verify payment and activate subscription
export const verifyPayment = api(
    { expose: true, auth: true, method: "POST", path: "/api/subscriptions/verify" },
    async (params: { paymentId: string; authorization: Header<"Authorization"> }): Promise<{ success: boolean; subscription?: Subscription }> => {
        // Get user from session
        const token = params.authorization.replace("Bearer ", "");
        const session = await db.queryRow`
            SELECT user_id as "userId" FROM sessions WHERE token = ${token} AND expires_at > NOW()
        `;
        if (!session) throw APIError.unauthenticated("invalid session");

        // Get payment
        const payment = await db.queryRow`
            SELECT id, user_id as "userId", yoco_checkout_id as "yocoCheckoutId", amount_cents as "amountCents", status
            FROM payments WHERE id = ${params.paymentId}
        `;
        if (!payment) throw APIError.notFound("payment not found");
        if (payment.userId !== session.userId) throw APIError.permissionDenied("not your payment");
        if (payment.status === 'completed') {
            // Already processed
            const sub = await db.queryRow`
                SELECT id, user_id as "userId", package_id as "packageId", status,
                       current_period_start as "currentPeriodStart", current_period_end as "currentPeriodEnd",
                       created_at as "createdAt", updated_at as "updatedAt"
                FROM subscriptions WHERE user_id = ${session.userId} AND status = 'active'
            `;
            if (sub) {
                return {
                    success: true,
                    subscription: {
                        id: sub.id,
                        userId: sub.userId,
                        packageId: sub.packageId,
                        status: sub.status,
                        currentPeriodStart: sub.currentPeriodStart?.toISOString(),
                        currentPeriodEnd: sub.currentPeriodEnd?.toISOString(),
                        createdAt: sub.createdAt.toISOString(),
                        updatedAt: sub.updatedAt.toISOString(),
                    }
                };
            }
        }

        // Verify with Yoco
        const yocoResponse = await fetch(`${YOCO_API_URL}/${payment.yocoCheckoutId}`, {
            headers: {
                "Authorization": `Bearer ${YOCO_SECRET_KEY()}`,
            },
        });

        if (!yocoResponse.ok) {
            throw APIError.internal("failed to verify payment");
        }

        const checkout = await yocoResponse.json() as { status: string; metadata?: { packageId?: string } };

        if (checkout.status !== 'completed') {
            return { success: false };
        }

        // Payment successful - update payment status
        await db.exec`UPDATE payments SET status = 'completed' WHERE id = ${params.paymentId}`;

        // Get package for subscription period
        const pkg = await db.queryRow`
            SELECT id, billing_period as "billingPeriod" FROM packages WHERE id = ${checkout.metadata?.packageId}
        `;

        // Create or update subscription
        const subId = `sub_${Math.random().toString(36).substring(2, 11)}${Date.now().toString(36)}`;
        const now = new Date();
        const periodEnd = pkg?.billingPeriod === 'monthly'
            ? new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
            : new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000); // 1 year for one-time

        await db.exec`
            INSERT INTO subscriptions (id, user_id, package_id, status, current_period_start, current_period_end)
            VALUES (${subId}, ${session.userId}, ${checkout.metadata?.packageId}, 'active', ${now}, ${periodEnd})
            ON CONFLICT (id) DO UPDATE SET
                status = 'active',
                current_period_start = ${now},
                current_period_end = ${periodEnd},
                updated_at = NOW()
        `;

        // Update payment with subscription ID
        await db.exec`UPDATE payments SET subscription_id = ${subId} WHERE id = ${params.paymentId}`;

        return {
            success: true,
            subscription: {
                id: subId,
                userId: session.userId,
                packageId: checkout.metadata?.packageId || '',
                status: 'active',
                currentPeriodStart: now.toISOString(),
                currentPeriodEnd: periodEnd.toISOString(),
                createdAt: now.toISOString(),
                updatedAt: now.toISOString(),
            }
        };
    }
);

// Get user's active subscription
export const getMySubscription = api(
    { expose: true, auth: true, method: "GET", path: "/api/subscriptions/me" },
    async (params: { authorization: Header<"Authorization"> }): Promise<{ subscription?: Subscription & { package?: Package } }> => {
        const token = params.authorization.replace("Bearer ", "");
        const session = await db.queryRow`
            SELECT user_id as "userId" FROM sessions WHERE token = ${token} AND expires_at > NOW()
        `;
        if (!session) throw APIError.unauthenticated("invalid session");

        const row = await db.queryRow`
            SELECT s.id, s.user_id as "userId", s.package_id as "packageId", s.status,
                   s.current_period_start as "currentPeriodStart", s.current_period_end as "currentPeriodEnd",
                   s.created_at as "createdAt", s.updated_at as "updatedAt",
                   p.name as "packageName", p.slug as "packageSlug", p.price_cents as "priceCents",
                   p.max_listings as "maxListings", p.top_agents as "topAgents", p.featured_listings as "featuredListings"
            FROM subscriptions s
            JOIN packages p ON s.package_id = p.id
            WHERE s.user_id = ${session.userId} AND s.status = 'active'
            ORDER BY s.created_at DESC
            LIMIT 1
        `;

        if (!row) return {};

        return {
            subscription: {
                id: row.id,
                userId: row.userId,
                packageId: row.packageId,
                status: row.status,
                currentPeriodStart: row.currentPeriodStart?.toISOString(),
                currentPeriodEnd: row.currentPeriodEnd?.toISOString(),
                createdAt: row.createdAt.toISOString(),
                updatedAt: row.updatedAt.toISOString(),
                package: {
                    id: row.packageId,
                    name: row.packageName,
                    slug: row.packageSlug,
                    description: '',
                    priceCents: row.priceCents,
                    billingPeriod: 'monthly',
                    maxListings: row.maxListings,
                    topAgents: row.topAgents,
                    featuredListings: row.featuredListings,
                    maxPhotos: 5, // Default for now
                    isActive: true,
                }
            }
        };
    }
);

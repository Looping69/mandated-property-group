import { api } from "encore.dev/api";
import { SQLDatabase } from "encore.dev/storage/sqldb";
import { Bucket } from "encore.dev/storage/objects";

// Import all services to ensure Encore discovers their endpoints
import "./contractors";
import "./conveyancers";
import "./tours";
import "./ai";
import "./agents";
import "./maintenance";
import "./users";
import "./agencies";

// Define a Postgres database named 'property'
export const db = new SQLDatabase("property", {
    migrations: "./migrations",
});

// Define a storage bucket for property media
export const mediaBucket = new Bucket("property-media", {
    public: true,
});

// --- Auth ---

import { authHandler } from "encore.dev/auth";
import { Header, Gateway } from "encore.dev/api";

interface AuthParams {
    authorization: Header<"Authorization">;
}

interface AuthData {
    userID: string;
}

// Clerk Authentication Handler
// This verifies the Clerk JWT in the Authorization header
export const auth = authHandler(async (params: AuthParams): Promise<AuthData> => {
    const token = params.authorization.replace("Bearer ", "");
    if (!token) {
        throw new Error("missing token");
    }

    // Since we are running in a demo/local environment, we'll extract the user ID
    // In a real production environment, we should verify the JWT signature using Clerk's public keys.
    // For local Encore dev, we'll manually parse it for now.
    try {
        // Simple JWT payload extraction (base64)
        const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
        return { userID: payload.sub };
    } catch (e) {
        throw new Error("invalid token");
    }
});

export const gateway = new Gateway({
    authHandler: auth,
});

// --- Types ---

export interface Listing {
    id: string;
    title: string;
    price: number;
    address: string;
    description: string;
    beds: number;
    baths: number;
    garage: string;
    pool: string;
    image: string;
    images: string[];
    agentId: string;
    isFeatured: boolean;
    status: string;
    isPetFriendly: boolean;
    viewingType: string;
    onShowDate?: string;
}

export interface Agent {
    id: string;
    name: string;
    email: string;
    phone: string;
    title?: string;
    image?: string;
    sales?: string;
}

export interface Inquiry {
    id: string;
    listingId?: string;
    agentId?: string;
    customerName: string;
    customerEmail: string;
    message: string;
    status: string;
    date: string;
}

// Params for POST requests (Encore requires simple interfaces, no utility types like Omit)
export interface CreateListingParams {
    title: string;
    price: number;
    address: string;
    description: string;
    beds: number;
    baths: number;
    garage: string;
    pool: string;
    image: string;
    images: string[];
    agentId: string;
    isFeatured: boolean;
    status: string;
    isPetFriendly: boolean;
    viewingType: string;
    onShowDate?: string;
}

export interface CreateInquiryParams {
    listingId?: string;
    agentId?: string;
    customerName: string;
    customerEmail: string;
    message: string;
}

// --- API Endpoints ---

// Home / Health Check
export const home = api(
    { expose: true, method: "GET", path: "/" },
    async () => {
        return { message: "Mandated Property Group API is Online" };
    }
);

// Properties
export const listProperties = api(
    { expose: true, method: "GET", path: "/api/properties" },
    async (): Promise<{ listings: Listing[] }> => {
        const listings: Listing[] = [];
        const rows = db.query`
            SELECT id, title, price, address, description, beds, baths, garage, pool, image_url as image, images, agent_id as "agentId", is_featured as "isFeatured", status, is_pet_friendly as "isPetFriendly", viewing_type as "viewingType", on_show_date as "onShowDate"
            FROM listings
        `;
        for await (const row of rows) {
            listings.push({
                id: row.id,
                title: row.title,
                price: Number(row.price),
                address: row.address,
                description: row.description,
                beds: row.beds,
                baths: Number(row.baths),
                garage: row.garage || "None",
                pool: row.pool || "none",
                image: row.image,
                images: row.images || [],
                agentId: row.agentId,
                isFeatured: row.isFeatured,
                status: row.status,
                isPetFriendly: row.isPetFriendly,
                viewingType: row.viewingType || 'appointment',
                onShowDate: row.onShowDate,
            });
        }
        return { listings };
    }
);

export const getProperty = api(
    { expose: true, method: "GET", path: "/api/properties/:id" },
    async ({ id }: { id: string }): Promise<{ listing?: Listing }> => {
        const rows = db.query`
            SELECT id, title, price, address, description, beds, baths, garage, pool, image_url as image, images, agent_id as "agentId", is_featured as "isFeatured", status, is_pet_friendly as "isPetFriendly", viewing_type as "viewingType", on_show_date as "onShowDate"
            FROM listings
            WHERE id = ${id}
        `;
        for await (const row of rows) {
            return {
                listing: {
                    id: row.id,
                    title: row.title,
                    price: Number(row.price),
                    address: row.address,
                    description: row.description,
                    beds: row.beds,
                    baths: Number(row.baths),
                    garage: row.garage || "None",
                    pool: row.pool || "none",
                    image: row.image,
                    images: row.images || [],
                    agentId: row.agentId,
                    isFeatured: row.isFeatured,
                    status: row.status,
                    isPetFriendly: row.isPetFriendly,
                    viewingType: row.viewingType || 'appointment',
                    onShowDate: row.onShowDate,
                }
            };
        }
        return {};
    }
);

export const createProperty = api(
    { expose: true, auth: true, method: "POST", path: "/api/properties" },
    async (params: CreateListingParams): Promise<Listing> => {
        const id = `p_${Math.random().toString(36).substring(2, 11)}${Date.now().toString(36)}`;
        await db.exec`
            INSERT INTO listings (id, title, price, address, description, beds, baths, garage, pool, image_url, images, agent_id, is_featured, status, is_pet_friendly, viewing_type, on_show_date)
            VALUES (${id}, ${params.title}, ${params.price}, ${params.address}, ${params.description}, ${params.beds}, ${params.baths}, ${params.garage}, ${params.pool}, ${params.image}, ${params.images}, ${params.agentId}, ${params.isFeatured}, ${params.status}, ${params.isPetFriendly}, ${params.viewingType}, ${params.onShowDate})
        `;
        return { ...params, id };
    }
);

export const updateProperty = api(
    { expose: true, auth: true, method: "PUT", path: "/api/properties/:id" },
    async ({ id, ...updates }: { id: string } & Partial<CreateListingParams>): Promise<Listing> => {
        // Implementation of Optimized Dynamic SQL Update (Single Round-trip)
        // Using COALESCE/ISNULL pattern to update only provided fields
        await db.exec`
            UPDATE listings 
            SET 
                title = COALESCE(${updates.title ?? null}, title),
                price = COALESCE(${updates.price ?? null}, price),
                address = COALESCE(${updates.address ?? null}, address),
                description = COALESCE(${updates.description ?? null}, description),
                beds = COALESCE(${updates.beds ?? null}, beds),
                baths = COALESCE(${updates.baths ?? null}, baths),
                garage = COALESCE(${updates.garage ?? null}, garage),
                pool = COALESCE(${updates.pool ?? null}, pool),
                image_url = COALESCE(${updates.image ?? null}, image_url),
                images = COALESCE(${updates.images ?? null}, images),
                agent_id = COALESCE(${updates.agentId ?? null}, agent_id),
                is_featured = COALESCE(${updates.isFeatured ?? null}, is_featured),
                status = COALESCE(${updates.status ?? null}, status),
                is_pet_friendly = COALESCE(${updates.isPetFriendly ?? null}, is_pet_friendly),
                viewing_type = COALESCE(${updates.viewingType ?? null}, viewing_type),
                on_show_date = COALESCE(${updates.onShowDate ?? null}, on_show_date)
            WHERE id = ${id}
        `;

        const { listing } = await getProperty({ id });
        if (!listing) throw new Error("listing not found");
        return listing;
    }
);

export const deleteProperty = api(
    { expose: true, auth: true, method: "DELETE", path: "/api/properties/:id" },
    async ({ id }: { id: string }): Promise<void> => {
        await db.exec`DELETE FROM listings WHERE id = ${id}`;
    }
);

// Agents
// (Moved to agents.ts)

// Inquiries
export const listInquiries = api(
    { expose: true, method: "GET", path: "/inquiries" },
    async (): Promise<{ inquiries: Inquiry[] }> => {
        const inquiries: Inquiry[] = [];
        const rows = db.query`SELECT id, listing_id as "listingId", agent_id as "agentId", customer_name as "customerName", customer_email as "customerEmail", message, status, created_at as "date" FROM inquiries`;
        for await (const row of rows) {
            inquiries.push({
                id: row.id,
                listingId: row.listingId,
                agentId: row.agentId,
                customerName: row.customerName,
                customerEmail: row.customerEmail,
                message: row.message,
                status: row.status,
                date: row.date.toISOString(),
            });
        }
        return { inquiries };
    }
);

export const createInquiry = api(
    { expose: true, method: "POST", path: "/inquiries" },
    async (p: CreateInquiryParams): Promise<Inquiry> => {
        const id = Math.random().toString(36).substring(2, 11);
        const status = "new";
        const date = new Date().toISOString();
        const lId = p.listingId || null;
        const aId = p.agentId || null;
        await db.exec`
            INSERT INTO inquiries (id, listing_id, agent_id, customer_name, customer_email, message, status)
            VALUES (${id}, ${lId}, ${aId}, ${p.customerName}, ${p.customerEmail}, ${p.message}, ${status})
        `;
        return {
            id,
            listingId: p.listingId,
            agentId: p.agentId,
            customerName: p.customerName,
            customerEmail: p.customerEmail,
            message: p.message,
            status,
            date
        };
    }
);

// Ping
export const ping = api(
    { expose: true, method: "GET", path: "/ping" },
    async () => {
        return { message: "pong - Mandated Property Group Backend" };
    }
);

// Update Inquiry Status
export const updateInquiryStatus = api(
    { expose: true, method: "PUT", path: "/inquiries/:id/status" },
    async ({ id, status }: { id: string; status: string }): Promise<{ success: boolean }> => {
        await db.exec`UPDATE inquiries SET status = ${status} WHERE id = ${id}`;
        return { success: true };
    }
);

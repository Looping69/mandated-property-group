import { api } from "encore.dev/api";
import { SQLDatabase } from "encore.dev/storage/sqldb";
import { Bucket } from "encore.dev/storage/objects";

// Import all services to ensure Encore discovers their endpoints
import "./contractors";
import "./conveyancers";
import "./tours";
import "./ai";
import "./agents";

// Define a Postgres database named 'property'
export const db = new SQLDatabase("property", {
    migrations: "./migrations",
});

// Define a storage bucket for property media
export const mediaBucket = new Bucket("property-media", {
    public: true,
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
    size: number;
    image: string;
    images: string[];
    agentId: string;
    isFeatured: boolean;
    status: string;
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
    size: number;
    image: string;
    images: string[];
    agentId: string;
    isFeatured: boolean;
    status: string;
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
    { expose: true, method: "GET", path: "/properties" },
    async (): Promise<{ listings: Listing[] }> => {
        const listings: Listing[] = [];
        const rows = db.query`
            SELECT id, title, price, address, description, beds, baths, size, image_url as image, images, agent_id as "agentId", is_featured as "isFeatured", status, on_show_date as "onShowDate"
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
                size: row.size,
                image: row.image,
                images: row.images || [],
                agentId: row.agentId,
                isFeatured: row.isFeatured,
                status: row.status,
                onShowDate: row.onShowDate,
            });
        }
        return { listings };
    }
);

export const createProperty = api(
    { expose: true, method: "POST", path: "/properties" },
    async (params: CreateListingParams): Promise<Listing> => {
        const id = Math.random().toString(36).substring(2, 11);
        await db.exec`
            INSERT INTO listings (id, title, price, address, description, beds, baths, size, image_url, images, agent_id, is_featured, status, on_show_date)
            VALUES (${id}, ${params.title}, ${params.price}, ${params.address}, ${params.description}, ${params.beds}, ${params.baths}, ${params.size}, ${params.image}, ${params.images}, ${params.agentId}, ${params.isFeatured}, ${params.status}, ${params.onShowDate})
        `;
        return { ...params, id };
    }
);

export const deleteProperty = api(
    { expose: true, method: "DELETE", path: "/properties/:id" },
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

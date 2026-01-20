import { api } from "encore.dev/api";
import { db } from "./property";

// --- Types ---

interface SuccessResponse {
    success: boolean;
}

export interface Contractor {
    id: string;
    name: string;
    trade: string;
    location: string;
    rating: number;
    image: string;
    phone: string;
    email: string;
    description: string;
    isVerified: boolean;
    hourlyRate: number;
    status?: string;
}

// ... existing CreateContractorParams ...
export interface CreateContractorParams {
    name: string;
    trade: string;
    location: string;
    rating: number;
    image: string;
    phone: string;
    email: string;
    description: string;
    isVerified: boolean;
    hourlyRate: number;
}

// --- API Endpoints ---

export const listContractors = api(
    { expose: true, method: "GET", path: "/api/contractors" },
    async (): Promise<{ contractors: Contractor[] }> => {
        const contractors: Contractor[] = [];
        const rows = db.query`
            SELECT id, name, trade, location, rating, image_url as image, phone, email, description, is_verified as "isVerified", hourly_rate as "hourlyRate", status
            FROM contractors
        `;
        for await (const row of rows) {
            contractors.push({
                id: row.id,
                name: row.name,
                trade: row.trade,
                location: row.location,
                rating: Number(row.rating),
                image: row.image,
                phone: row.phone,
                email: row.email,
                description: row.description,
                isVerified: row.isVerified,
                hourlyRate: Number(row.hourlyRate),
                status: row.status || 'active',
            });
        }
        return { contractors };
    }
);

export const createContractor = api(
    { expose: true, method: "POST", path: "/api/contractors" },
    async (params: CreateContractorParams): Promise<Contractor> => {
        const id = `c${Math.random().toString(36).substring(2, 9)}`;
        await db.exec`
            INSERT INTO contractors (id, name, trade, location, rating, image_url, phone, email, description, is_verified, hourly_rate, status)
            VALUES (${id}, ${params.name}, ${params.trade}, ${params.location}, ${params.rating}, ${params.image}, ${params.phone}, ${params.email}, ${params.description}, ${params.isVerified}, ${params.hourlyRate}, 'active')
        `;
        return { ...params, id, status: 'active' };
    }
);

export const deleteContractor = api(
    { expose: true, method: "DELETE", path: "/api/contractors/:id" },
    async ({ id }: { id: string }): Promise<void> => {
        await db.exec`DELETE FROM contractors WHERE id = ${id}`;
    }
);

// Suspend/Activate contractor
export const updateContractorStatus = api(
    { expose: true, auth: true, method: "PUT", path: "/api/contractors/:id/status" },
    async ({ id, status }: { id: string; status: string }): Promise<SuccessResponse> => {
        await db.exec`UPDATE contractors SET status = ${status} WHERE id = ${id}`;
        return { success: true };
    }
);



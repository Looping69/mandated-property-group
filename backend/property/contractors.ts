import { api } from "encore.dev/api";
import { db } from "./property";

// --- Types ---

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
}

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
    { expose: true, method: "GET", path: "/contractors" },
    async (): Promise<{ contractors: Contractor[] }> => {
        const contractors: Contractor[] = [];
        const rows = db.query`
            SELECT id, name, trade, location, rating, image_url as image, phone, email, description, is_verified as "isVerified", hourly_rate as "hourlyRate"
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
            });
        }
        return { contractors };
    }
);

export const createContractor = api(
    { expose: true, method: "POST", path: "/contractors" },
    async (params: CreateContractorParams): Promise<Contractor> => {
        const id = `c${Math.random().toString(36).substring(2, 9)}`;
        await db.exec`
            INSERT INTO contractors (id, name, trade, location, rating, image_url, phone, email, description, is_verified, hourly_rate)
            VALUES (${id}, ${params.name}, ${params.trade}, ${params.location}, ${params.rating}, ${params.image}, ${params.phone}, ${params.email}, ${params.description}, ${params.isVerified}, ${params.hourlyRate})
        `;
        return { ...params, id };
    }
);

export const deleteContractor = api(
    { expose: true, method: "DELETE", path: "/contractors/:id" },
    async ({ id }: { id: string }): Promise<void> => {
        await db.exec`DELETE FROM contractors WHERE id = ${id}`;
    }
);

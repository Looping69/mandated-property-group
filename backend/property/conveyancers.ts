import { api } from "encore.dev/api";
import { db } from "./property";

// --- Types ---

export interface Conveyancer {
    id: string;
    name: string;
    specialist: string;
    location: string;
    rating: number;
    image: string;
    website: string;
    phone: string;
    isVerified: boolean;
}

export interface CreateConveyancerParams {
    name: string;
    specialist: string;
    location: string;
    rating: number;
    image: string;
    website: string;
    phone: string;
    isVerified: boolean;
}

// --- API Endpoints ---

export const listConveyancers = api(
    { expose: true, method: "GET", path: "/api/conveyancers" },
    async (): Promise<{ conveyancers: Conveyancer[] }> => {
        const conveyancers: Conveyancer[] = [];
        const rows = db.query`
            SELECT id, name, specialist, location, rating, image_url as image, website, phone, is_verified as "isVerified"
            FROM conveyancers
        `;
        for await (const row of rows) {
            conveyancers.push({
                id: row.id,
                name: row.name,
                specialist: row.specialist,
                location: row.location,
                rating: Number(row.rating),
                image: row.image,
                website: row.website,
                phone: row.phone,
                isVerified: row.isVerified,
            });
        }
        return { conveyancers };
    }
);

export const createConveyancer = api(
    { expose: true, method: "POST", path: "/api/conveyancers" },
    async (params: CreateConveyancerParams): Promise<Conveyancer> => {
        const id = `cv${Math.random().toString(36).substring(2, 9)}`;
        await db.exec`
            INSERT INTO conveyancers (id, name, specialist, location, rating, image_url, website, phone, is_verified)
            VALUES (${id}, ${params.name}, ${params.specialist}, ${params.location}, ${params.rating}, ${params.image}, ${params.website}, ${params.phone}, ${params.isVerified})
        `;
        return { ...params, id };
    }
);

export const deleteConveyancer = api(
    { expose: true, method: "DELETE", path: "/api/conveyancers/:id" },
    async ({ id }: { id: string }): Promise<void> => {
        await db.exec`DELETE FROM conveyancers WHERE id = ${id}`;
    }
);

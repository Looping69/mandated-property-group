import { api } from "encore.dev/api";
import { db } from "./property";

// --- Types ---

export interface TourStop {
    id: string;
    tourId: string;
    title: string;
    description: string;
    image: string;
    order: number;
}

export interface VirtualTour {
    id: string;
    title: string;
    agentId: string;
    listingId?: string;
    status: string;
    voiceUri?: string;
    date: string;
    stops: TourStop[];
}

export interface CreateTourParams {
    title: string;
    agentId: string;
    listingId?: string;
    status: string;
    voiceUri?: string;
}

export interface CreateTourStopParams {
    tourId: string;
    title: string;
    description: string;
    image: string;
    order: number;
}

// --- API Endpoints ---

export const listTours = api(
    { expose: true, method: "GET", path: "/tours" },
    async (): Promise<{ tours: VirtualTour[] }> => {
        const toursMap = new Map<string, VirtualTour>();

        // Get all tours
        const tourRows = db.query`
            SELECT id, title, agent_id as "agentId", listing_id as "listingId", status, voice_uri as "voiceUri", created_at as "date"
            FROM virtual_tours
        `;
        for await (const row of tourRows) {
            toursMap.set(row.id, {
                id: row.id,
                title: row.title,
                agentId: row.agentId,
                listingId: row.listingId,
                status: row.status,
                voiceUri: row.voiceUri,
                date: row.date.toISOString(),
                stops: [],
            });
        }

        // Get all stops
        const stopRows = db.query`
            SELECT id, tour_id as "tourId", title, description, image_url as image, "order"
            FROM tour_stops
            ORDER BY "order" ASC
        `;
        for await (const row of stopRows) {
            const tour = toursMap.get(row.tourId);
            if (tour) {
                tour.stops.push({
                    id: row.id,
                    tourId: row.tourId,
                    title: row.title,
                    description: row.description,
                    image: row.image,
                    order: row.order,
                });
            }
        }

        return { tours: Array.from(toursMap.values()) };
    }
);

export const createTour = api(
    { expose: true, method: "POST", path: "/tours" },
    async (params: CreateTourParams): Promise<VirtualTour> => {
        const id = `vt${Math.random().toString(36).substring(2, 9)}`;
        const date = new Date().toISOString();
        const listingId = params.listingId || null;
        const voiceUri = params.voiceUri || null;

        await db.exec`
            INSERT INTO virtual_tours (id, title, agent_id, listing_id, status, voice_uri)
            VALUES (${id}, ${params.title}, ${params.agentId}, ${listingId}, ${params.status}, ${voiceUri})
        `;

        return {
            id,
            title: params.title,
            agentId: params.agentId,
            listingId: params.listingId,
            status: params.status,
            voiceUri: params.voiceUri,
            date,
            stops: [],
        };
    }
);

export const addTourStop = api(
    { expose: true, method: "POST", path: "/tours/:tourId/stops" },
    async (params: CreateTourStopParams): Promise<TourStop> => {
        const id = `ts${Math.random().toString(36).substring(2, 9)}`;

        await db.exec`
            INSERT INTO tour_stops (id, tour_id, title, description, image_url, "order")
            VALUES (${id}, ${params.tourId}, ${params.title}, ${params.description}, ${params.image}, ${params.order})
        `;

        return { ...params, id };
    }
);

export const deleteTour = api(
    { expose: true, method: "DELETE", path: "/tours/:id" },
    async ({ id }: { id: string }): Promise<void> => {
        // Stops are deleted via CASCADE
        await db.exec`DELETE FROM virtual_tours WHERE id = ${id}`;
    }
);

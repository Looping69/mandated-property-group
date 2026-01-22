import { api } from "encore.dev/api";
import { db } from "./property";

// --- Types ---

// Voice presets for Google Cloud TTS
export type VoicePreset = 'JAMES' | 'OLIVIA';

export interface TourStop {
    id: string;
    tourId: string;
    title: string;
    description: string;
    image: string;
    audioUrl?: string;  // Pre-generated TTS audio (base64 data URL)
    order: number;
}

export interface VirtualTour {
    id: string;
    title: string;
    agentId: string;
    listingId?: string;
    status: string;
    voicePreset?: VoicePreset;  // Premium Google Cloud TTS voice
    voiceUri?: string;          // Legacy browser TTS fallback
    date: string;
    stops: TourStop[];
}

export interface CreateTourParams {
    title: string;
    agentId: string;
    listingId?: string;
    status: string;
    voicePreset?: VoicePreset;
    voiceUri?: string;
}

export interface CreateTourStopParams {
    tourId: string;
    title: string;
    description: string;
    image: string;
    audioUrl?: string;  // Pre-generated TTS audio
    order: number;
}

// --- API Endpoints ---

export const listTours = api(
    { expose: true, method: "GET", path: "/api/tours" },
    async (): Promise<{ tours: VirtualTour[] }> => {
        const toursMap = new Map<string, VirtualTour>();

        // Get all tours
        const tourRows = db.query`
            SELECT id, title, agent_id as "agentId", listing_id as "listingId", status, voice_preset as "voicePreset", voice_uri as "voiceUri", created_at as "date"
            FROM virtual_tours
        `;
        for await (const row of tourRows) {
            toursMap.set(row.id, {
                id: row.id,
                title: row.title,
                agentId: row.agentId,
                listingId: row.listingId,
                status: row.status,
                voicePreset: row.voicePreset as VoicePreset | undefined,
                voiceUri: row.voiceUri,
                date: row.date.toISOString(),
                stops: [],
            });
        }

        // Get all stops
        const stopRows = db.query`
            SELECT id, tour_id as "tourId", title, description, image_url as image, audio_url as "audioUrl", "order"
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
                    audioUrl: row.audioUrl,
                    order: row.order,
                });
            }
        }

        return { tours: Array.from(toursMap.values()) };
    }
);

export const createTour = api(
    { expose: true, method: "POST", path: "/api/tours" },
    async (params: CreateTourParams): Promise<VirtualTour> => {
        try {
            // Check if agent has "Top Agent" status via active subscription
            const topAgentCheck = await db.queryRow`
                SELECT p.top_agents as "topAgents"
                FROM users u
                JOIN subscriptions s ON u.id = s.user_id
                JOIN packages p ON s.package_id = p.id
                WHERE u.agent_id = ${params.agentId} 
                  AND s.status = 'active'
                  AND s.current_period_end > NOW()
                  AND p.top_agents > 0
            `;

            if (!topAgentCheck || topAgentCheck.topAgents === 0) {
                throw APIError.permissionDenied("Creating virtual tours is a feature reserved for Top Agents. Please upgrade your plan.");
            }

            // Check if agent has any listings
            const listingCount = await db.queryRow`
                SELECT COUNT(*) as count FROM listings WHERE agent_id = ${params.agentId}
            `;
            if (!listingCount || listingCount.count === 0) {
                throw APIError.failedPrecondition("You must have at least one active listing to create a virtual tour.");
            }

            const id = `vt${Math.random().toString(36).substring(2, 9)}`;
            const date = new Date().toISOString();
            const listingId = params.listingId || null;
            const voicePreset = params.voicePreset || null;
            const voiceUri = params.voiceUri || null;

            await db.exec`
                INSERT INTO virtual_tours (id, title, agent_id, listing_id, status, voice_preset, voice_uri)
                VALUES (${id}, ${params.title}, ${params.agentId}, ${listingId}, ${params.status}, ${voicePreset}, ${voiceUri})
            `;

            return {
                id,
                title: params.title,
                agentId: params.agentId,
                listingId: params.listingId,
                status: params.status,
                voicePreset: params.voicePreset,
                voiceUri: params.voiceUri,
                date,
                stops: [],
            };
        } catch (error) {
            console.error("Create Tour Error:", error);
            throw error;
        }
    }
);

export const addTourStop = api(
    { expose: true, method: "POST", path: "/api/tours/:tourId/stops" },
    async (params: CreateTourStopParams): Promise<TourStop> => {
        try {
            const id = `ts${Math.random().toString(36).substring(2, 9)}`;
            const audioUrl = params.audioUrl || null;

            await db.exec`
                INSERT INTO tour_stops (id, tour_id, title, description, image_url, audio_url, "order")
                VALUES (${id}, ${params.tourId}, ${params.title}, ${params.description}, ${params.image}, ${audioUrl}, ${params.order})
            `;

            return { ...params, id };
        } catch (error) {
            console.error("Add Tour Stop Error:", error);
            throw error;
        }
    }
);

export const deleteTour = api(
    { expose: true, method: "DELETE", path: "/api/tours/:id" },
    async ({ id }: { id: string }): Promise<void> => {
        // Stops are deleted via CASCADE
        await db.exec`DELETE FROM virtual_tours WHERE id = ${id}`;
    }
);

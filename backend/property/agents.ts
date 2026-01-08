import { api } from "encore.dev/api";
import { db } from "./property";

// --- Types ---

export interface Agent {
    id: string;
    name: string;
    email: string;
    phone: string;
    title?: string;
    image?: string;
    sales?: string;
}

export interface CreateAgentParams {
    name: string;
    email: string;
    phone: string;
    title?: string;
    image?: string;
    sales?: string;
}

// --- API Endpoints ---

export const listAgents = api(
    { expose: true, method: "GET", path: "/api/agents" },
    async (): Promise<{ agents: Agent[] }> => {
        const agents: Agent[] = [];
        const rows = db.query`SELECT id, name, email, phone FROM agents`;
        for await (const row of rows) {
            agents.push({
                id: row.id,
                name: row.name,
                email: row.email,
                phone: row.phone,
                // Note: The agents table in schema only has name, email, phone. 
                // We might need to migrate to add title, image, sales if we want to store them.
                // For now, I will omit fields not in the DB, or stick to the DB schema.
            });
        }
        return { agents };
    }
);

export const createAgent = api(
    { expose: true, auth: true, method: "POST", path: "/api/agents" },
    async (params: CreateAgentParams): Promise<Agent> => {
        const id = `a_${Math.random().toString(36).substring(2, 11)}${Date.now().toString(36)}`;
        await db.exec`
            INSERT INTO agents (id, name, email, phone)
            VALUES (${id}, ${params.name}, ${params.email}, ${params.phone})
        `;
        return { ...params, id };
    }
);

export const deleteAgent = api(
    { expose: true, auth: true, method: "DELETE", path: "/api/agents/:id" },
    async ({ id }: { id: string }): Promise<void> => {
        await db.exec`DELETE FROM agents WHERE id = ${id}`;
    }
);

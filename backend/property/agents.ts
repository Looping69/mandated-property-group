import { api } from "encore.dev/api";
import { db } from "./property";

// --- Types ---

// Response type for agent status update
interface SuccessResponse {
    success: boolean;
}

export interface Agent {
    id: string;
    name: string;
    email: string;
    phone: string;
    title?: string;
    image?: string;
    sales?: string;
    status?: string;
}

// ... existing CreateAgentParams ...
export interface CreateAgentParams {
    name: string;
    email: string;
    phone: string;
    title?: string;
    image?: string;
    sales?: string;
}

// ... existing listAgents ...
export const listAgents = api(
    { expose: true, method: "GET", path: "/api/agents" },
    async (): Promise<{ agents: Agent[] }> => {
        const agents: Agent[] = [];
        const rows = db.query`SELECT id, name, email, phone, title, image, sales, status FROM agents`;
        for await (const row of rows) {
            agents.push({
                id: row.id,
                name: row.name,
                email: row.email,
                phone: row.phone,
                title: row.title || undefined,
                image: row.image || undefined,
                sales: row.sales || undefined,
                status: row.status || 'active',
            });
        }
        return { agents };
    }
);

// ... existing createAgent ...
export const createAgent = api(
    { expose: true, auth: true, method: "POST", path: "/api/agents" },
    async (params: CreateAgentParams): Promise<Agent> => {
        const id = `a_${Math.random().toString(36).substring(2, 11)}${Date.now().toString(36)}`;
        await db.exec`
            INSERT INTO agents (id, name, email, phone, status)
            VALUES (${id}, ${params.name}, ${params.email}, ${params.phone}, 'active')
        `;
        return { ...params, id, status: 'active' };
    }
);

// ... existing deleteAgent ...
export const deleteAgent = api(
    { expose: true, auth: true, method: "DELETE", path: "/api/agents/:id" },
    async ({ id }: { id: string }): Promise<void> => {
        await db.exec`DELETE FROM agents WHERE id = ${id}`;
    }
);

// Suspend/Activate agent
export const updateAgentStatus = api(
    { expose: true, auth: true, method: "PUT", path: "/api/agents/:id/status" },
    async ({ id, status }: { id: string; status: string }): Promise<SuccessResponse> => {
        await db.exec`UPDATE agents SET status = ${status} WHERE id = ${id}`;
        return { success: true };
    }
);

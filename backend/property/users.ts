import { api } from "encore.dev/api";
import { db } from "./property";

// --- Types ---

export type UserRole = 'AGENT' | 'AGENCY' | 'CONTRACTOR';

export interface User {
    id: string;
    clerkId: string;
    email: string;
    role: UserRole;
    firstName?: string;
    lastName?: string;
    phone?: string;
    imageUrl?: string;
    agentId?: string;
    contractorId?: string;
    isVerified: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateUserParams {
    clerkId: string;
    email: string;
    role: UserRole;
    firstName?: string;
    lastName?: string;
    phone?: string;
    imageUrl?: string;
    // Link to role-specific entity
    agentId?: string;
    contractorId?: string;
}

export interface UpdateUserParams {
    firstName?: string;
    lastName?: string;
    phone?: string;
    imageUrl?: string;
    isVerified?: boolean;
    isActive?: boolean;
}

// --- API Endpoints ---

// Get user by Clerk ID
export const getUserByClerkId = api(
    { expose: true, method: "GET", path: "/api/users/clerk/:clerkId" },
    async ({ clerkId }: { clerkId: string }): Promise<{ user?: User }> => {
        const rows = db.query`
            SELECT 
                id, clerk_id as "clerkId", email, role,
                first_name as "firstName", last_name as "lastName",
                phone, image_url as "imageUrl",
                agent_id as "agentId", contractor_id as "contractorId",
                is_verified as "isVerified", is_active as "isActive",
                created_at as "createdAt", updated_at as "updatedAt"
            FROM users
            WHERE clerk_id = ${clerkId}
        `;
        for await (const row of rows) {
            return {
                user: {
                    id: row.id,
                    clerkId: row.clerkId,
                    email: row.email,
                    role: row.role as UserRole,
                    firstName: row.firstName,
                    lastName: row.lastName,
                    phone: row.phone,
                    imageUrl: row.imageUrl,
                    agentId: row.agentId,
                    contractorId: row.contractorId,
                    isVerified: row.isVerified,
                    isActive: row.isActive,
                    createdAt: row.createdAt.toISOString(),
                    updatedAt: row.updatedAt.toISOString(),
                }
            };
        }
        return {};
    }
);

// Get user by email
export const getUserByEmail = api(
    { expose: true, method: "GET", path: "/api/users/email/:email" },
    async ({ email }: { email: string }): Promise<{ user?: User }> => {
        const rows = db.query`
            SELECT 
                id, clerk_id as "clerkId", email, role,
                first_name as "firstName", last_name as "lastName",
                phone, image_url as "imageUrl",
                agent_id as "agentId", contractor_id as "contractorId",
                is_verified as "isVerified", is_active as "isActive",
                created_at as "createdAt", updated_at as "updatedAt"
            FROM users
            WHERE email = ${email}
        `;
        for await (const row of rows) {
            return {
                user: {
                    id: row.id,
                    clerkId: row.clerkId,
                    email: row.email,
                    role: row.role as UserRole,
                    firstName: row.firstName,
                    lastName: row.lastName,
                    phone: row.phone,
                    imageUrl: row.imageUrl,
                    agentId: row.agentId,
                    contractorId: row.contractorId,
                    isVerified: row.isVerified,
                    isActive: row.isActive,
                    createdAt: row.createdAt.toISOString(),
                    updatedAt: row.updatedAt.toISOString(),
                }
            };
        }
        return {};
    }
);

// Create user (typically called after Clerk signup)
export const createUser = api(
    { expose: true, method: "POST", path: "/api/users" },
    async (params: CreateUserParams): Promise<User> => {
        const id = `u_${Math.random().toString(36).substring(2, 11)}${Date.now().toString(36)}`;
        const now = new Date();

        const agentId = params.agentId || null;
        const contractorId = params.contractorId || null;
        const firstName = params.firstName || null;
        const lastName = params.lastName || null;
        const phone = params.phone || null;
        const imageUrl = params.imageUrl || null;

        const row = await db.queryRow`
            INSERT INTO users (
                id, clerk_id, email, role, first_name, last_name, 
                phone, image_url, agent_id, contractor_id,
                is_verified, is_active, created_at, updated_at
            ) VALUES (
                ${id}, ${params.clerkId}, ${params.email}, ${params.role},
                ${firstName}, ${lastName}, ${phone}, ${imageUrl},
                ${agentId}, ${contractorId}, false, true, ${now}, ${now}
            )
            ON CONFLICT (clerk_id) DO UPDATE SET
                email = EXCLUDED.email,
                role = EXCLUDED.role,
                first_name = COALESCE(EXCLUDED.first_name, users.first_name),
                last_name = COALESCE(EXCLUDED.last_name, users.last_name),
                phone = COALESCE(EXCLUDED.phone, users.phone),
                image_url = COALESCE(EXCLUDED.image_url, users.image_url),
                agent_id = COALESCE(EXCLUDED.agent_id, users.agent_id),
                contractor_id = COALESCE(EXCLUDED.contractor_id, users.contractor_id),
                updated_at = EXCLUDED.updated_at
            RETURNING id, clerk_id as "clerkId", email, role, first_name as "firstName", last_name as "lastName", phone, image_url as "imageUrl", agent_id as "agentId", contractor_id as "contractorId", is_verified as "isVerified", is_active as "isActive", created_at as "createdAt", updated_at as "updatedAt"
        `;

        if (!row) throw new Error("Failed to create/update user");

        return {
            id: row.id,
            clerkId: row.clerkId,
            email: row.email,
            role: row.role as UserRole,
            firstName: row.firstName || undefined,
            lastName: row.lastName || undefined,
            phone: row.phone || undefined,
            imageUrl: row.imageUrl || undefined,
            agentId: row.agentId || undefined,
            contractorId: row.contractorId || undefined,
            isVerified: row.isVerified,
            isActive: row.isActive,
            createdAt: row.createdAt.toISOString(),
            updatedAt: row.updatedAt.toISOString(),
        };
    }
);

// Update user
export const updateUser = api(
    { expose: true, auth: true, method: "PUT", path: "/api/users/:id" },
    async ({ id, ...updates }: { id: string } & UpdateUserParams): Promise<{ success: boolean }> => {
        const now = new Date();

        await db.exec`
            UPDATE users 
            SET 
                first_name = COALESCE(${updates.firstName ?? null}, first_name),
                last_name = COALESCE(${updates.lastName ?? null}, last_name),
                phone = COALESCE(${updates.phone ?? null}, phone),
                image_url = COALESCE(${updates.imageUrl ?? null}, image_url),
                is_verified = COALESCE(${updates.isVerified ?? null}, is_verified),
                is_active = COALESCE(${updates.isActive ?? null}, is_active),
                updated_at = ${now}
            WHERE id = ${id}
        `;

        return { success: true };
    }
);

// Get all users (admin endpoint)
export const listUsers = api(
    { expose: true, auth: true, method: "GET", path: "/api/users" },
    async (): Promise<{ users: User[] }> => {
        const users: User[] = [];
        const rows = db.query`
            SELECT 
                id, clerk_id as "clerkId", email, role,
                first_name as "firstName", last_name as "lastName",
                phone, image_url as "imageUrl",
                agent_id as "agentId", contractor_id as "contractorId",
                is_verified as "isVerified", is_active as "isActive",
                created_at as "createdAt", updated_at as "updatedAt"
            FROM users
            ORDER BY created_at DESC
        `;
        for await (const row of rows) {
            users.push({
                id: row.id,
                clerkId: row.clerkId,
                email: row.email,
                role: row.role as UserRole,
                firstName: row.firstName,
                lastName: row.lastName,
                phone: row.phone,
                imageUrl: row.imageUrl,
                agentId: row.agentId,
                contractorId: row.contractorId,
                isVerified: row.isVerified,
                isActive: row.isActive,
                createdAt: row.createdAt.toISOString(),
                updatedAt: row.updatedAt.toISOString(),
            });
        }
        return { users };
    }
);

// Get users by role
export const getUsersByRole = api(
    { expose: true, method: "GET", path: "/api/users/role/:role" },
    async ({ role }: { role: string }): Promise<{ users: User[] }> => {
        const users: User[] = [];
        const rows = db.query`
            SELECT 
                id, clerk_id as "clerkId", email, role,
                first_name as "firstName", last_name as "lastName",
                phone, image_url as "imageUrl",
                agent_id as "agentId", contractor_id as "contractorId",
                is_verified as "isVerified", is_active as "isActive",
                created_at as "createdAt", updated_at as "updatedAt"
            FROM users
            WHERE role = ${role}
            ORDER BY created_at DESC
        `;
        for await (const row of rows) {
            users.push({
                id: row.id,
                clerkId: row.clerkId,
                email: row.email,
                role: row.role as UserRole,
                firstName: row.firstName,
                lastName: row.lastName,
                phone: row.phone,
                imageUrl: row.imageUrl,
                agentId: row.agentId,
                contractorId: row.contractorId,
                isVerified: row.isVerified,
                isActive: row.isActive,
                createdAt: row.createdAt.toISOString(),
                updatedAt: row.updatedAt.toISOString(),
            });
        }
        return { users };
    }
);

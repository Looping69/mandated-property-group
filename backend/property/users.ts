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
        const id = `u${Math.random().toString(36).substring(2, 9)}`;
        const now = new Date();

        const agentId = params.agentId || null;
        const contractorId = params.contractorId || null;
        const firstName = params.firstName || null;
        const lastName = params.lastName || null;
        const phone = params.phone || null;
        const imageUrl = params.imageUrl || null;

        await db.exec`
            INSERT INTO users (
                id, clerk_id, email, role, first_name, last_name, 
                phone, image_url, agent_id, contractor_id,
                is_verified, is_active, created_at, updated_at
            ) VALUES (
                ${id}, ${params.clerkId}, ${params.email}, ${params.role},
                ${firstName}, ${lastName}, ${phone}, ${imageUrl},
                ${agentId}, ${contractorId}, false, true, ${now}, ${now}
            )
        `;

        return {
            id,
            clerkId: params.clerkId,
            email: params.email,
            role: params.role,
            firstName: params.firstName,
            lastName: params.lastName,
            phone: params.phone,
            imageUrl: params.imageUrl,
            agentId: params.agentId,
            contractorId: params.contractorId,
            isVerified: false,
            isActive: true,
            createdAt: now.toISOString(),
            updatedAt: now.toISOString(),
        };
    }
);

// Update user
export const updateUser = api(
    { expose: true, method: "PUT", path: "/api/users/:id" },
    async ({ id, ...updates }: { id: string } & UpdateUserParams): Promise<{ success: boolean }> => {
        const now = new Date();

        if (updates.firstName !== undefined) {
            await db.exec`UPDATE users SET first_name = ${updates.firstName}, updated_at = ${now} WHERE id = ${id}`;
        }
        if (updates.lastName !== undefined) {
            await db.exec`UPDATE users SET last_name = ${updates.lastName}, updated_at = ${now} WHERE id = ${id}`;
        }
        if (updates.phone !== undefined) {
            await db.exec`UPDATE users SET phone = ${updates.phone}, updated_at = ${now} WHERE id = ${id}`;
        }
        if (updates.imageUrl !== undefined) {
            await db.exec`UPDATE users SET image_url = ${updates.imageUrl}, updated_at = ${now} WHERE id = ${id}`;
        }
        if (updates.isVerified !== undefined) {
            await db.exec`UPDATE users SET is_verified = ${updates.isVerified}, updated_at = ${now} WHERE id = ${id}`;
        }
        if (updates.isActive !== undefined) {
            await db.exec`UPDATE users SET is_active = ${updates.isActive}, updated_at = ${now} WHERE id = ${id}`;
        }

        return { success: true };
    }
);

// Get all users (admin endpoint)
export const listUsers = api(
    { expose: true, method: "GET", path: "/api/users" },
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

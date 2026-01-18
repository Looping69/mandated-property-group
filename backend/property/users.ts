import { api } from "encore.dev/api";
import { db } from "./property";

// --- Types ---

export type UserRole = 'BROWSER' | 'AGENT' | 'AGENCY' | 'CONTRACTOR' | 'ADMIN';

export interface User {
    id: string;
    email: string;
    role: UserRole;
    firstName?: string;
    lastName?: string;
    phone?: string;
    imageUrl?: string;
    agentId?: string;
    contractorId?: string;
    agencyId?: string; // For agents linked to an agency
    isVerified: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateUserParams {
    email: string;
    password?: string;
    role: UserRole;
    firstName?: string;
    lastName?: string;
    phone?: string;
    imageUrl?: string;
    // Link to role-specific entity
    agentId?: string;
    contractorId?: string;
    agencyId?: string;
}

export interface UpdateUserParams {
    firstName?: string;
    lastName?: string;
    phone?: string;
    imageUrl?: string;
    isVerified?: boolean;
    isActive?: boolean;
    agentId?: string;
    contractorId?: string;
    agencyId?: string;
}

// --- API Endpoints ---

// --- Auth Endpoints ---

import { APIError } from "encore.dev/api";
import bcrypt from "bcryptjs";

export interface SignupParams extends CreateUserParams {
    firstName: string;
    lastName: string;
}

export const signup = api(
    { expose: true, method: "POST", path: "/api/auth/signup" },
    async (params: SignupParams): Promise<{ user: User; token: string }> => {
        if (!params.password) throw APIError.invalidArgument("password is required");

        const passwordHash = await bcrypt.hash(params.password, 10);
        const id = `u_${Math.random().toString(36).substring(2, 11)}${Date.now().toString(36)}`;
        const now = new Date();

        await db.exec`
            INSERT INTO users (id, email, password_hash, role, first_name, last_name, agency_id, created_at, updated_at)
            VALUES (${id}, ${params.email}, ${passwordHash}, ${params.role}, ${params.firstName}, ${params.lastName}, ${params.agencyId || null}, ${now}, ${now})
        `;

        const token = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

        await db.exec`
            INSERT INTO sessions (token, user_id, expires_at)
            VALUES (${token}, ${id}, ${expiresAt})
        `;

        const user: User = {
            id,
            email: params.email,
            role: params.role,
            firstName: params.firstName,
            lastName: params.lastName,
            isVerified: false,
            isActive: true,
            createdAt: now.toISOString(),
            updatedAt: now.toISOString(),
        };

        return { user, token };
    }
);

export const login = api(
    { expose: true, method: "POST", path: "/api/auth/login" },
    async (params: { email: string; password?: string }): Promise<{ user: User; token: string }> => {
        const row = await db.queryRow`
            SELECT id, email, password_hash as "passwordHash", role, first_name as "firstName", last_name as "lastName", is_verified as "isVerified", is_active as "isActive", created_at as "createdAt", updated_at as "updatedAt"
            FROM users
            WHERE email = ${params.email}
        `;

        if (!row || !row.passwordHash) {
            throw APIError.unauthenticated("invalid email or password");
        }

        const valid = await bcrypt.compare(params.password || "", row.passwordHash);
        if (!valid) {
            throw APIError.unauthenticated("invalid email or password");
        }

        const token = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

        await db.exec`
            INSERT INTO sessions (token, user_id, expires_at)
            VALUES (${token}, ${row.id}, ${expiresAt})
        `;

        const user: User = {
            id: row.id,
            email: row.email,
            role: row.role as UserRole,
            firstName: row.firstName,
            lastName: row.lastName,
            isVerified: row.isVerified,
            isActive: row.isActive,
            createdAt: row.createdAt.toISOString(),
            updatedAt: row.updatedAt.toISOString(),
        };

        return { user, token };
    }
);

export const logout = api(
    { expose: true, auth: true, method: "POST", path: "/api/auth/logout" },
    async (): Promise<void> => {
        // Implementation would need the token from the header, but Encore's authHandler
        // is where we'd ideally handle this if we want to delete the session.
        // For now, let's assume we just want to clear it if we have access to it.
        // In a stateless JWT system we wouldn't need this, but we have a sessions table.
    }
);

// Get user by ID (replaces getUserByClerkId)
export const getUserById = api(
    { expose: true, auth: true, method: "GET", path: "/api/users/:id" },
    async ({ id }: { id: string }): Promise<{ user?: User }> => {
        const rows = db.query`
            SELECT 
                id, email, role,
                first_name as "firstName", last_name as "lastName",
                phone, image_url as "imageUrl",
                agent_id as "agentId", contractor_id as "contractorId", agency_id as "agencyId",
                is_verified as "isVerified", is_active as "isActive",
                created_at as "createdAt", updated_at as "updatedAt"
            FROM users
            WHERE id = ${id}
        `;
        for await (const row of rows) {
            return {
                user: {
                    id: row.id,
                    email: row.email,
                    role: row.role as UserRole,
                    firstName: row.firstName,
                    lastName: row.lastName,
                    phone: row.phone,
                    imageUrl: row.imageUrl,
                    agentId: row.agentId,
                    contractorId: row.contractorId,
                    agencyId: row.agencyId,
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
                id, email, role,
                first_name as "firstName", last_name as "lastName",
                phone, image_url as "imageUrl",
                agent_id as "agentId", contractor_id as "contractorId", agency_id as "agencyId",
                is_verified as "isVerified", is_active as "isActive",
                created_at as "createdAt", updated_at as "updatedAt"
            FROM users
            WHERE email = ${email}
        `;
        for await (const row of rows) {
            return {
                user: {
                    id: row.id,
                    email: row.email,
                    role: row.role as UserRole,
                    firstName: row.firstName,
                    lastName: row.lastName,
                    phone: row.phone,
                    imageUrl: row.imageUrl,
                    agentId: row.agentId,
                    contractorId: row.contractorId,
                    agencyId: row.agencyId,
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

// Create user
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
                id, email, role, first_name, last_name, 
                phone, image_url, agent_id, contractor_id, agency_id,
                is_verified, is_active, created_at, updated_at
            ) VALUES (
                ${id}, ${params.email}, ${params.role},
                ${firstName}, ${lastName}, ${phone}, ${imageUrl},
                ${agentId}, ${contractorId}, ${params.agencyId || null}, false, true, ${now}, ${now}
            )
            ON CONFLICT (email) DO UPDATE SET
                role = EXCLUDED.role,
                first_name = COALESCE(EXCLUDED.first_name, users.first_name),
                last_name = COALESCE(EXCLUDED.last_name, users.last_name),
                phone = COALESCE(EXCLUDED.phone, users.phone),
                image_url = COALESCE(EXCLUDED.image_url, users.image_url),
                agent_id = COALESCE(EXCLUDED.agent_id, users.agent_id),
                contractor_id = COALESCE(EXCLUDED.contractor_id, users.contractor_id),
                agency_id = COALESCE(EXCLUDED.agency_id, users.agency_id),
                updated_at = EXCLUDED.updated_at
            RETURNING id, email, role, first_name as "firstName", last_name as "lastName", phone, image_url as "imageUrl", agent_id as "agentId", contractor_id as "contractorId", agency_id as "agencyId", is_verified as "isVerified", is_active as "isActive", created_at as "createdAt", updated_at as "updatedAt"
        `;

        if (!row) throw new Error("Failed to create/update user");

        return {
            id: row.id,
            email: row.email,
            role: row.role as UserRole,
            firstName: row.firstName || undefined,
            lastName: row.lastName || undefined,
            phone: row.phone || undefined,
            imageUrl: row.imageUrl || undefined,
            agentId: row.agentId || undefined,
            contractorId: row.contractorId || undefined,
            agencyId: row.agencyId || undefined,
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
                agent_id = COALESCE(${updates.agentId ?? null}, agent_id),
                contractor_id = COALESCE(${updates.contractorId ?? null}, contractor_id),
                agency_id = COALESCE(${updates.agencyId ?? null}, agency_id),
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
                id, email, role,
                first_name as "firstName", last_name as "lastName",
                phone, image_url as "imageUrl",
                agent_id as "agentId", contractor_id as "contractorId", agency_id as "agencyId",
                is_verified as "isVerified", is_active as "isActive",
                created_at as "createdAt", updated_at as "updatedAt"
            FROM users
            ORDER BY created_at DESC
        `;
        for await (const row of rows) {
            users.push({
                id: row.id,
                email: row.email,
                role: row.role as UserRole,
                firstName: row.firstName,
                lastName: row.lastName,
                phone: row.phone,
                imageUrl: row.imageUrl,
                agentId: row.agentId,
                contractorId: row.contractorId,
                agencyId: row.agencyId,
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
                id, email, role,
                first_name as "firstName", last_name as "lastName",
                phone, image_url as "imageUrl",
                agent_id as "agentId", contractor_id as "contractorId", agency_id as "agencyId",
                is_verified as "isVerified", is_active as "isActive",
                created_at as "createdAt", updated_at as "updatedAt"
            FROM users
            WHERE role = ${role}
            ORDER BY created_at DESC
        `;
        for await (const row of rows) {
            users.push({
                id: row.id,
                email: row.email,
                role: row.role as UserRole,
                firstName: row.firstName,
                lastName: row.lastName,
                phone: row.phone,
                imageUrl: row.imageUrl,
                agentId: row.agentId,
                contractorId: row.contractorId,
                agencyId: row.agencyId,
                isVerified: row.isVerified,
                isActive: row.isActive,
                createdAt: row.createdAt.toISOString(),
                updatedAt: row.updatedAt.toISOString(),
            });
        }
        return { users };
    }
);

import { api, APIError, Header } from "encore.dev/api";
import { db, AuthData } from "./property";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// ============================================================================
// TYPES
// ============================================================================

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
    agencyId?: string;
    isVerified: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

// ============================================================================
// AUTH ENDPOINTS
// ============================================================================

interface SignupParams {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    phone?: string;
    imageUrl?: string;
    agentId?: string;
    contractorId?: string;
    agencyId?: string;
}

interface LoginParams {
    email: string;
    password: string;
}

interface AuthResponse {
    user: User;
    token: string;
}

// Generate unique ID
function generateId(prefix: string): string {
    return `${prefix}_${Math.random().toString(36).substring(2, 11)}${Date.now().toString(36)}`;
}

// Generate session token
function generateToken(): string {
    return crypto.randomBytes(48).toString('base64');
}

/**
 * Sign up a new user
 */
export const signup = api(
    { expose: true, method: "POST", path: "/api/auth/signup" },
    async (params: SignupParams): Promise<AuthResponse> => {
        // Validate required fields
        if (!params.email || !params.email.includes('@')) {
            throw APIError.invalidArgument("Valid email is required");
        }
        if (!params.password || params.password.length < 8) {
            throw APIError.invalidArgument("Password must be at least 8 characters");
        }
        if (!/[A-Z]/.test(params.password) || !/[a-z]/.test(params.password) || !/[0-9]/.test(params.password)) {
            throw APIError.invalidArgument("Password must contain uppercase, lowercase, and a number");
        }
        if (!params.firstName || !params.lastName) {
            throw APIError.invalidArgument("First name and last name are required");
        }

        // Check if user already exists
        const email = params.email.toLowerCase().trim();
        const existing = await db.queryRow`
            SELECT id FROM users WHERE email = ${email}
        `;
        if (existing) {
            throw APIError.alreadyExists("An account with this email already exists");
        }

        // Hash password
        const passwordHash = await bcrypt.hash(params.password, 12);
        const userId = generateId('u');
        const now = new Date();

        // Insert user
        await db.exec`
            INSERT INTO users (
                id, email, password_hash, role, 
                first_name, last_name, phone, image_url,
                agent_id, contractor_id, agency_id,
                is_verified, is_active, created_at, updated_at
            ) VALUES (
                ${userId}, ${email}, ${passwordHash}, ${params.role},
                ${params.firstName}, ${params.lastName}, ${params.phone || null}, ${params.imageUrl || null},
                ${params.agentId || null}, ${params.contractorId || null}, ${params.agencyId || null},
                false, true, ${now}, ${now}
            )
        `;

        // Create session
        const token = generateToken();
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

        await db.exec`
            INSERT INTO sessions (token, user_id, expires_at)
            VALUES (${token}, ${userId}, ${expiresAt})
        `;

        const user: User = {
            id: userId,
            email: params.email,
            role: params.role,
            firstName: params.firstName,
            lastName: params.lastName,
            phone: params.phone,
            imageUrl: params.imageUrl,
            agentId: params.agentId,
            contractorId: params.contractorId,
            agencyId: params.agencyId,
            isVerified: false,
            isActive: true,
            createdAt: now.toISOString(),
            updatedAt: now.toISOString(),
        };

        return { user, token };
    }
);

/**
 * Log in an existing user
 */
export const login = api(
    { expose: true, method: "POST", path: "/api/auth/login" },
    async (params: LoginParams): Promise<AuthResponse> => {
        if (!params.email || !params.password) {
            throw APIError.invalidArgument("Email and password are required");
        }

        // Find user by email
        const email = params.email.toLowerCase().trim();
        const row = await db.queryRow`
            SELECT 
                id, email, password_hash, role,
                first_name, last_name, phone, image_url,
                agent_id, contractor_id, agency_id,
                is_verified, is_active, created_at, updated_at
            FROM users
            WHERE email = ${email}
        `;

        if (!row) {
            throw APIError.unauthenticated("Invalid email or password");
        }

        if (!row.password_hash) {
            throw APIError.unauthenticated("Invalid email or password");
        }

        // Verify password
        const validPassword = await bcrypt.compare(params.password, row.password_hash);
        if (!validPassword) {
            throw APIError.unauthenticated("Invalid email or password");
        }

        // Check if user is active
        if (!row.is_active) {
            throw APIError.permissionDenied("Your account has been deactivated");
        }

        // Create new session
        const token = generateToken();
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

        await db.exec`
            INSERT INTO sessions (token, user_id, expires_at)
            VALUES (${token}, ${row.id}, ${expiresAt})
        `;

        const user: User = {
            id: row.id,
            email: row.email,
            role: row.role as UserRole,
            firstName: row.first_name,
            lastName: row.last_name,
            phone: row.phone,
            imageUrl: row.image_url,
            agentId: row.agent_id,
            contractorId: row.contractor_id,
            agencyId: row.agency_id,
            isVerified: row.is_verified,
            isActive: row.is_active,
            createdAt: row.created_at.toISOString(),
            updatedAt: row.updated_at.toISOString(),
        };

        return { user, token };
    }
);

/**
 * Validate session and get current user
 */
export const me = api(
    { expose: true, method: "POST", path: "/api/auth/me" },
    async ({ token }: { token: string }): Promise<{ user: User | null }> => {
        if (!token) {
            return { user: null };
        }

        // Find valid session
        const session = await db.queryRow`
            SELECT user_id, expires_at FROM sessions
            WHERE token = ${token}
        `;

        if (!session || new Date(session.expires_at) < new Date()) {
            return { user: null };
        }

        // Get user
        const row = await db.queryRow`
            SELECT 
                id, email, role,
                first_name, last_name, phone, image_url,
                agent_id, contractor_id, agency_id,
                is_verified, is_active, created_at, updated_at
            FROM users
            WHERE id = ${session.user_id}
        `;

        if (!row || !row.is_active) {
            return { user: null };
        }

        return {
            user: {
                id: row.id,
                email: row.email,
                role: row.role as UserRole,
                firstName: row.first_name,
                lastName: row.last_name,
                phone: row.phone,
                imageUrl: row.image_url,
                agentId: row.agent_id,
                contractorId: row.contractor_id,
                agencyId: row.agency_id,
                isVerified: row.is_verified,
                isActive: row.is_active,
                createdAt: row.created_at.toISOString(),
                updatedAt: row.updated_at.toISOString(),
            }
        };
    }
);

/**
 * Log out - invalidate session
 */
export const logout = api(
    { expose: true, method: "POST", path: "/api/auth/logout" },
    async ({ token }: { token: string }): Promise<{ success: boolean }> => {
        if (token) {
            await db.exec`DELETE FROM sessions WHERE token = ${token}`;
        }
        return { success: true };
    }
);

// ============================================================================
// USER MANAGEMENT ENDPOINTS
// ============================================================================

interface UpdateUserParams {
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

/**
 * Get user by ID
 */
export const getUserById = api(
    { expose: true, auth: true, method: "GET", path: "/api/users/:id" },
    async ({ id }: { id: string }): Promise<{ user: User | null }> => {
        const row = await db.queryRow`
            SELECT 
                id, email, role,
                first_name, last_name, phone, image_url,
                agent_id, contractor_id, agency_id,
                is_verified, is_active, created_at, updated_at
            FROM users
            WHERE id = ${id}
        `;

        if (!row) {
            return { user: null };
        }

        return {
            user: {
                id: row.id,
                email: row.email,
                role: row.role as UserRole,
                firstName: row.first_name,
                lastName: row.last_name,
                phone: row.phone,
                imageUrl: row.image_url,
                agentId: row.agent_id,
                contractorId: row.contractor_id,
                agencyId: row.agency_id,
                isVerified: row.is_verified,
                isActive: row.is_active,
                createdAt: row.created_at.toISOString(),
                updatedAt: row.updated_at.toISOString(),
            }
        };
    }
);

/**
 * Get user by email
 */
export const getUserByEmail = api(
    { expose: true, auth: true, method: "GET", path: "/api/users/email/:email" },
    async ({ email }: { email: string }): Promise<{ user: User | null }> => {
        const row = await db.queryRow`
            SELECT 
                id, email, role,
                first_name, last_name, phone, image_url,
                agent_id, contractor_id, agency_id,
                is_verified, is_active, created_at, updated_at
            FROM users
            WHERE email = ${email}
        `;

        if (!row) {
            return { user: null };
        }

        return {
            user: {
                id: row.id,
                email: row.email,
                role: row.role as UserRole,
                firstName: row.first_name,
                lastName: row.last_name,
                phone: row.phone,
                imageUrl: row.image_url,
                agentId: row.agent_id,
                contractorId: row.contractor_id,
                agencyId: row.agency_id,
                isVerified: row.is_verified,
                isActive: row.is_active,
                createdAt: row.created_at.toISOString(),
                updatedAt: row.updated_at.toISOString(),
            }
        };
    }
);

/**
 * Update user
 */
export const updateUser = api(
    { expose: true, auth: true, method: "PUT", path: "/api/users/:id" },
    async (params: { id: string; authorization: Header<"Authorization"> } & UpdateUserParams): Promise<{ success: boolean }> => {
        const { id, authorization, ...updates } = params;
        const authData = await getUserFromHeader(authorization);

        // Authorization check: Only ADMIN or the user themselves can update
        if (authData.role !== 'ADMIN' && authData.userID !== id) {
            throw APIError.permissionDenied("You do not have permission to update this user");
        }

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

/**
 * List all users (admin only)
 */
export const listUsers = api(
    { expose: true, auth: true, method: "GET", path: "/api/users" },
    async (params: { authorization: Header<"Authorization"> }): Promise<{ users: User[] }> => {
        const authData = await getUserFromHeader(params.authorization);

        if (authData.role !== 'ADMIN') {
            throw APIError.permissionDenied("Admin access required");
        }

        const users: User[] = [];
        const rows = db.query`
            SELECT 
                id, email, role,
                first_name, last_name, phone, image_url,
                agent_id, contractor_id, agency_id,
                is_verified, is_active, created_at, updated_at
            FROM users
            ORDER BY created_at DESC
        `;

        for await (const row of rows) {
            users.push({
                id: row.id,
                email: row.email,
                role: row.role as UserRole,
                firstName: row.first_name,
                lastName: row.last_name,
                phone: row.phone,
                imageUrl: row.image_url,
                agentId: row.agent_id,
                contractorId: row.contractor_id,
                agencyId: row.agency_id,
                isVerified: row.is_verified,
                isActive: row.is_active,
                createdAt: row.created_at.toISOString(),
                updatedAt: row.updated_at.toISOString(),
            });
        }

        return { users };
    }
);

/**
 * Get users by role (admin only)
 */
export const getUsersByRole = api(
    { expose: true, auth: true, method: "GET", path: "/api/users/role/:role" },
    async (params: { role: string; authorization: Header<"Authorization"> }): Promise<{ users: User[] }> => {
        const { role, authorization } = params;
        const authData = await getUserFromHeader(authorization);

        if (authData.role !== 'ADMIN') {
            throw APIError.permissionDenied("Admin access required");
        }

        const users: User[] = [];
        const rows = db.query`
            SELECT 
                id, email, role,
                first_name, last_name, phone, image_url,
                agent_id, contractor_id, agency_id,
                is_verified, is_active, created_at, updated_at
            FROM users
            WHERE role = ${role}
            ORDER BY created_at DESC
        `;

        for await (const row of rows) {
            users.push({
                id: row.id,
                email: row.email,
                role: row.role as UserRole,
                firstName: row.first_name,
                lastName: row.last_name,
                phone: row.phone,
                imageUrl: row.image_url,
                agentId: row.agent_id,
                contractorId: row.contractor_id,
                agencyId: row.agency_id,
                isVerified: row.is_verified,
                isActive: row.is_active,
                createdAt: row.created_at.toISOString(),
                updatedAt: row.updated_at.toISOString(),
            });
        }

        return { users };
    }
);

/**
 * Internal helper to validate session and get user data
 * Duplicated from property.ts for convenience in this module
 */
async function getUserFromHeader(authorization: string): Promise<AuthData> {
    const token = authorization.replace("Bearer ", "");
    const row = await db.queryRow`
        SELECT 
            s.user_id as "userID",
            u.role as "role",
            u.agent_id as "agentID",
            u.agency_id as "agencyID",
            u.contractor_id as "contractorID"
        FROM sessions s
        JOIN users u ON s.user_id = u.id
        WHERE s.token = ${token} AND s.expires_at > NOW()
    `;
    if (!row) throw APIError.unauthenticated("invalid session");
    return {
        userID: row.userID,
        role: row.role,
        agentID: row.agentID || undefined,
        agencyID: row.agencyID || undefined,
        contractorID: row.contractorID || undefined
    };
}

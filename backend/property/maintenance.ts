import { api } from "encore.dev/api";
import { db } from "./property";

// --- Types ---

export interface MaintenanceRequest {
    id: string;
    listingId?: string;
    contractorId?: string;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
    category: string;
    reportedBy: string;
    assignedTo?: string;
    images?: string[];
    estimatedCost?: number;
    actualCost?: number;
    completedAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateMaintenanceParams {
    listingId?: string;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    category: string;
    reportedBy: string;
    images?: string[];
    estimatedCost?: number;
}

export interface UpdateMaintenanceParams {
    title?: string;
    description?: string;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    category?: string;
    estimatedCost?: number;
    actualCost?: number;
}

// --- API Endpoints ---

// List all maintenance requests
export const listMaintenance = api(
    { expose: true, method: "GET", path: "/api/maintenance" },
    async (): Promise<{ requests: MaintenanceRequest[] }> => {
        const requests: MaintenanceRequest[] = [];
        const rows = db.query`
            SELECT 
                id, listing_id as "listingId", contractor_id as "contractorId",
                title, description, priority, status, category,
                reported_by as "reportedBy", assigned_to as "assignedTo",
                images, estimated_cost as "estimatedCost", actual_cost as "actualCost",
                completed_at as "completedAt", created_at as "createdAt", updated_at as "updatedAt"
            FROM maintenance_requests
            ORDER BY created_at DESC
        `;
        for await (const row of rows) {
            requests.push({
                id: row.id,
                listingId: row.listingId,
                contractorId: row.contractorId,
                title: row.title,
                description: row.description,
                priority: row.priority,
                status: row.status,
                category: row.category,
                reportedBy: row.reportedBy,
                assignedTo: row.assignedTo,
                images: row.images || [],
                estimatedCost: row.estimatedCost ? Number(row.estimatedCost) : undefined,
                actualCost: row.actualCost ? Number(row.actualCost) : undefined,
                completedAt: row.completedAt?.toISOString(),
                createdAt: row.createdAt.toISOString(),
                updatedAt: row.updatedAt.toISOString(),
            });
        }
        return { requests };
    }
);

// Get single maintenance request
export const getMaintenance = api(
    { expose: true, method: "GET", path: "/api/maintenance/:id" },
    async ({ id }: { id: string }): Promise<{ request?: MaintenanceRequest }> => {
        const rows = db.query`
            SELECT 
                id, listing_id as "listingId", contractor_id as "contractorId",
                title, description, priority, status, category,
                reported_by as "reportedBy", assigned_to as "assignedTo",
                images, estimated_cost as "estimatedCost", actual_cost as "actualCost",
                completed_at as "completedAt", created_at as "createdAt", updated_at as "updatedAt"
            FROM maintenance_requests
            WHERE id = ${id}
        `;
        for await (const row of rows) {
            return {
                request: {
                    id: row.id,
                    listingId: row.listingId,
                    contractorId: row.contractorId,
                    title: row.title,
                    description: row.description,
                    priority: row.priority,
                    status: row.status,
                    category: row.category,
                    reportedBy: row.reportedBy,
                    assignedTo: row.assignedTo,
                    images: row.images || [],
                    estimatedCost: row.estimatedCost ? Number(row.estimatedCost) : undefined,
                    actualCost: row.actualCost ? Number(row.actualCost) : undefined,
                    completedAt: row.completedAt?.toISOString(),
                    createdAt: row.createdAt.toISOString(),
                    updatedAt: row.updatedAt.toISOString(),
                }
            };
        }
        return {};
    }
);

// Get maintenance requests by contractor
export const getMaintenanceByContractor = api(
    { expose: true, method: "GET", path: "/api/maintenance/contractor/:contractorId" },
    async ({ contractorId }: { contractorId: string }): Promise<{ requests: MaintenanceRequest[] }> => {
        const requests: MaintenanceRequest[] = [];
        const rows = db.query`
            SELECT 
                id, listing_id as "listingId", contractor_id as "contractorId",
                title, description, priority, status, category,
                reported_by as "reportedBy", assigned_to as "assignedTo",
                images, estimated_cost as "estimatedCost", actual_cost as "actualCost",
                completed_at as "completedAt", created_at as "createdAt", updated_at as "updatedAt"
            FROM maintenance_requests
            WHERE contractor_id = ${contractorId} OR assigned_to = ${contractorId}
            ORDER BY created_at DESC
        `;
        for await (const row of rows) {
            requests.push({
                id: row.id,
                listingId: row.listingId,
                contractorId: row.contractorId,
                title: row.title,
                description: row.description,
                priority: row.priority,
                status: row.status,
                category: row.category,
                reportedBy: row.reportedBy,
                assignedTo: row.assignedTo,
                images: row.images || [],
                estimatedCost: row.estimatedCost ? Number(row.estimatedCost) : undefined,
                actualCost: row.actualCost ? Number(row.actualCost) : undefined,
                completedAt: row.completedAt?.toISOString(),
                createdAt: row.createdAt.toISOString(),
                updatedAt: row.updatedAt.toISOString(),
            });
        }
        return { requests };
    }
);

// Get maintenance requests by listing
export const getMaintenanceByListing = api(
    { expose: true, method: "GET", path: "/api/maintenance/listing/:listingId" },
    async ({ listingId }: { listingId: string }): Promise<{ requests: MaintenanceRequest[] }> => {
        const requests: MaintenanceRequest[] = [];
        const rows = db.query`
            SELECT 
                id, listing_id as "listingId", contractor_id as "contractorId",
                title, description, priority, status, category,
                reported_by as "reportedBy", assigned_to as "assignedTo",
                images, estimated_cost as "estimatedCost", actual_cost as "actualCost",
                completed_at as "completedAt", created_at as "createdAt", updated_at as "updatedAt"
            FROM maintenance_requests
            WHERE listing_id = ${listingId}
            ORDER BY created_at DESC
        `;
        for await (const row of rows) {
            requests.push({
                id: row.id,
                listingId: row.listingId,
                contractorId: row.contractorId,
                title: row.title,
                description: row.description,
                priority: row.priority,
                status: row.status,
                category: row.category,
                reportedBy: row.reportedBy,
                assignedTo: row.assignedTo,
                images: row.images || [],
                estimatedCost: row.estimatedCost ? Number(row.estimatedCost) : undefined,
                actualCost: row.actualCost ? Number(row.actualCost) : undefined,
                completedAt: row.completedAt?.toISOString(),
                createdAt: row.createdAt.toISOString(),
                updatedAt: row.updatedAt.toISOString(),
            });
        }
        return { requests };
    }
);

// Create maintenance request
export const createMaintenance = api(
    { expose: true, method: "POST", path: "/api/maintenance" },
    async (params: CreateMaintenanceParams): Promise<MaintenanceRequest> => {
        const id = `m${Math.random().toString(36).substring(2, 9)}`;
        const now = new Date();
        const listingId = params.listingId || null;
        const estimatedCost = params.estimatedCost || null;
        const images = params.images || [];

        await db.exec`
            INSERT INTO maintenance_requests (
                id, listing_id, title, description, priority, status, 
                category, reported_by, images, estimated_cost, created_at, updated_at
            ) VALUES (
                ${id}, ${listingId}, ${params.title}, ${params.description}, 
                ${params.priority}, 'pending', ${params.category}, ${params.reportedBy}, 
                ${images}, ${estimatedCost}, ${now}, ${now}
            )
        `;

        return {
            id,
            listingId: params.listingId,
            title: params.title,
            description: params.description,
            priority: params.priority,
            status: 'pending',
            category: params.category,
            reportedBy: params.reportedBy,
            images: params.images,
            estimatedCost: params.estimatedCost,
            createdAt: now.toISOString(),
            updatedAt: now.toISOString(),
        };
    }
);

// Update maintenance request
export const updateMaintenance = api(
    { expose: true, method: "PUT", path: "/api/maintenance/:id" },
    async ({ id, ...updates }: { id: string } & UpdateMaintenanceParams): Promise<{ success: boolean }> => {
        const now = new Date();

        // Build dynamic update - for simplicity, update all provided fields
        if (updates.title !== undefined) {
            await db.exec`UPDATE maintenance_requests SET title = ${updates.title}, updated_at = ${now} WHERE id = ${id}`;
        }
        if (updates.description !== undefined) {
            await db.exec`UPDATE maintenance_requests SET description = ${updates.description}, updated_at = ${now} WHERE id = ${id}`;
        }
        if (updates.priority !== undefined) {
            await db.exec`UPDATE maintenance_requests SET priority = ${updates.priority}, updated_at = ${now} WHERE id = ${id}`;
        }
        if (updates.category !== undefined) {
            await db.exec`UPDATE maintenance_requests SET category = ${updates.category}, updated_at = ${now} WHERE id = ${id}`;
        }
        if (updates.estimatedCost !== undefined) {
            await db.exec`UPDATE maintenance_requests SET estimated_cost = ${updates.estimatedCost}, updated_at = ${now} WHERE id = ${id}`;
        }
        if (updates.actualCost !== undefined) {
            await db.exec`UPDATE maintenance_requests SET actual_cost = ${updates.actualCost}, updated_at = ${now} WHERE id = ${id}`;
        }

        return { success: true };
    }
);

// Delete maintenance request
export const deleteMaintenance = api(
    { expose: true, method: "DELETE", path: "/api/maintenance/:id" },
    async ({ id }: { id: string }): Promise<void> => {
        await db.exec`DELETE FROM maintenance_requests WHERE id = ${id}`;
    }
);

// Assign to contractor
export const assignMaintenance = api(
    { expose: true, method: "POST", path: "/api/maintenance/:id/assign" },
    async ({ id, contractorId }: { id: string; contractorId: string }): Promise<{ success: boolean }> => {
        const now = new Date();
        await db.exec`
            UPDATE maintenance_requests 
            SET assigned_to = ${contractorId}, contractor_id = ${contractorId}, 
                status = 'assigned', updated_at = ${now}
            WHERE id = ${id}
        `;
        return { success: true };
    }
);

// Update status
export const updateMaintenanceStatus = api(
    { expose: true, method: "PUT", path: "/api/maintenance/:id/status" },
    async ({ id, status }: { id: string; status: MaintenanceRequest['status'] }): Promise<{ success: boolean }> => {
        const now = new Date();
        const completedAt = status === 'completed' ? now : null;

        await db.exec`
            UPDATE maintenance_requests 
            SET status = ${status}, updated_at = ${now}, completed_at = ${completedAt}
            WHERE id = ${id}
        `;
        return { success: true };
    }
);

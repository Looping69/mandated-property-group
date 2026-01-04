import { api } from "encore.dev/api";
import { db } from "./property";

// --- Types ---

export interface Agency {
    id: string;
    name: string;
    registrationNumber?: string;
    principalName?: string;
    officeAddress?: string;
    website?: string;
    phone?: string;
    email?: string;
    description?: string;
    logoUrl?: string;
    serviceAreas?: string;
    teamSize?: string;
    isFranchise: boolean;
    isVerified: boolean;
    createdAt: string;
}

export interface CreateAgencyParams {
    name: string;
    registrationNumber?: string;
    principalName?: string;
    officeAddress?: string;
    website?: string;
    phone?: string;
    email?: string;
    description?: string;
    logoUrl?: string;
    serviceAreas?: string;
    teamSize?: string;
    isFranchise?: boolean;
}

// --- API Endpoints ---

// List all agencies
export const listAgencies = api(
    { expose: true, method: "GET", path: "/agencies" },
    async (): Promise<{ agencies: Agency[] }> => {
        const agencies: Agency[] = [];
        const rows = db.query`
            SELECT 
                id, name, registration_number as "registrationNumber",
                principal_name as "principalName", office_address as "officeAddress",
                website, phone, email, description, logo_url as "logoUrl",
                service_areas as "serviceAreas", team_size as "teamSize",
                is_franchise as "isFranchise", is_verified as "isVerified",
                created_at as "createdAt"
            FROM agencies
            ORDER BY name
        `;
        for await (const row of rows) {
            agencies.push({
                id: row.id,
                name: row.name,
                registrationNumber: row.registrationNumber,
                principalName: row.principalName,
                officeAddress: row.officeAddress,
                website: row.website,
                phone: row.phone,
                email: row.email,
                description: row.description,
                logoUrl: row.logoUrl,
                serviceAreas: row.serviceAreas,
                teamSize: row.teamSize,
                isFranchise: row.isFranchise,
                isVerified: row.isVerified,
                createdAt: row.createdAt.toISOString(),
            });
        }
        return { agencies };
    }
);

// Get single agency
export const getAgency = api(
    { expose: true, method: "GET", path: "/agencies/:id" },
    async ({ id }: { id: string }): Promise<{ agency?: Agency }> => {
        const rows = db.query`
            SELECT 
                id, name, registration_number as "registrationNumber",
                principal_name as "principalName", office_address as "officeAddress",
                website, phone, email, description, logo_url as "logoUrl",
                service_areas as "serviceAreas", team_size as "teamSize",
                is_franchise as "isFranchise", is_verified as "isVerified",
                created_at as "createdAt"
            FROM agencies
            WHERE id = ${id}
        `;
        for await (const row of rows) {
            return {
                agency: {
                    id: row.id,
                    name: row.name,
                    registrationNumber: row.registrationNumber,
                    principalName: row.principalName,
                    officeAddress: row.officeAddress,
                    website: row.website,
                    phone: row.phone,
                    email: row.email,
                    description: row.description,
                    logoUrl: row.logoUrl,
                    serviceAreas: row.serviceAreas,
                    teamSize: row.teamSize,
                    isFranchise: row.isFranchise,
                    isVerified: row.isVerified,
                    createdAt: row.createdAt.toISOString(),
                }
            };
        }
        return {};
    }
);

// Create agency
export const createAgency = api(
    { expose: true, method: "POST", path: "/agencies" },
    async (params: CreateAgencyParams): Promise<Agency> => {
        const id = `ag${Math.random().toString(36).substring(2, 9)}`;
        const now = new Date();

        const registrationNumber = params.registrationNumber || null;
        const principalName = params.principalName || null;
        const officeAddress = params.officeAddress || null;
        const website = params.website || null;
        const phone = params.phone || null;
        const email = params.email || null;
        const description = params.description || null;
        const logoUrl = params.logoUrl || null;
        const serviceAreas = params.serviceAreas || null;
        const teamSize = params.teamSize || null;
        const isFranchise = params.isFranchise || false;

        await db.exec`
            INSERT INTO agencies (
                id, name, registration_number, principal_name, office_address,
                website, phone, email, description, logo_url,
                service_areas, team_size, is_franchise, is_verified, created_at
            ) VALUES (
                ${id}, ${params.name}, ${registrationNumber}, ${principalName}, ${officeAddress},
                ${website}, ${phone}, ${email}, ${description}, ${logoUrl},
                ${serviceAreas}, ${teamSize}, ${isFranchise}, false, ${now}
            )
        `;

        return {
            id,
            name: params.name,
            registrationNumber: params.registrationNumber,
            principalName: params.principalName,
            officeAddress: params.officeAddress,
            website: params.website,
            phone: params.phone,
            email: params.email,
            description: params.description,
            logoUrl: params.logoUrl,
            serviceAreas: params.serviceAreas,
            teamSize: params.teamSize,
            isFranchise: params.isFranchise || false,
            isVerified: false,
            createdAt: now.toISOString(),
        };
    }
);

// Delete agency
export const deleteAgency = api(
    { expose: true, method: "DELETE", path: "/agencies/:id" },
    async ({ id }: { id: string }): Promise<void> => {
        await db.exec`DELETE FROM agencies WHERE id = ${id}`;
    }
);

// Get agents for an agency
export const getAgencyAgents = api(
    { expose: true, method: "GET", path: "/agencies/:id/agents" },
    async ({ id }: { id: string }): Promise<{ agents: { id: string; name: string; email: string; title?: string }[] }> => {
        const agents: { id: string; name: string; email: string; title?: string }[] = [];
        const rows = db.query`
            SELECT id, name, email, title
            FROM agents
            WHERE agency_id = ${id}
            ORDER BY name
        `;
        for await (const row of rows) {
            agents.push({
                id: row.id,
                name: row.name,
                email: row.email,
                title: row.title,
            });
        }
        return { agents };
    }
);

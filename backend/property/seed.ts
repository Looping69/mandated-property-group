import { api } from "encore.dev/api";
import { db } from "./property";
import bcrypt from "bcryptjs";
import { UserRole } from "./users";

export const seedUsers = api(
    { expose: true, method: "POST", path: "/api/admin/seed" },
    async (): Promise<{ message: string; users: any[] }> => {
        const passwordHash = await bcrypt.hash("password123", 10);
        const now = new Date();

        const usersToSeed = [
            {
                email: "admin@example.com",
                firstName: "Admin",
                lastName: "User",
                role: "ADMIN" as UserRole,
                agencyId: null
            },
            {
                email: "agent@example.com",
                firstName: "Agent",
                lastName: "Smith",
                role: "AGENT" as UserRole,
                agencyId: null // Independent agent
            },
            {
                email: "agency@example.com",
                firstName: "Agency",
                lastName: "Manager",
                role: "AGENCY" as UserRole,
                agencyId: null
            },
            {
                email: "contractor@example.com",
                firstName: "Joe",
                lastName: "Builder",
                role: "CONTRACTOR" as UserRole,
                agencyId: null
            },
            {
                email: "browser@example.com",
                firstName: "John",
                lastName: "Doe",
                role: "BROWSER" as UserRole,
                agencyId: null
            }
        ];

        const results = [];

        for (const user of usersToSeed) {
            const id = user.role.toLowerCase() + "_id_" + Math.random().toString(36).substring(7);

            // Check if user exists
            const existing = await db.queryRow`SELECT id FROM users WHERE email = ${user.email}`;

            if (!existing) {
                await db.exec`
                    INSERT INTO users (id, email, password_hash, role, first_name, last_name, is_active, is_verified, created_at, updated_at)
                    VALUES (${id}, ${user.email}, ${passwordHash}, ${user.role}, ${user.firstName}, ${user.lastName}, true, true, ${now}, ${now})
                `;
                results.push({ ...user, status: "created" });
            } else {
                results.push({ ...user, status: "exists" });
            }
        }

        return { message: "Seeding complete", users: results };
    }
);

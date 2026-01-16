import { api } from "encore.dev/api";
import { db } from "./property";

export const seedDatabase = api(
    { expose: true, method: "POST", path: "/api/seed" },
    async (): Promise<{ success: boolean; message: string }> => {
        try {
            // Seed Agents
            const agents = [
                {
                    id: 'a1',
                    name: 'Victoria St. Clair',
                    email: 'victoria@mandated.co.za',
                    phone: '+27 82 555 0192',
                },
                {
                    id: 'a2',
                    name: 'Julian Thorne',
                    email: 'julian@mandated.co.za',
                    phone: '+27 83 555 0123',
                }
            ];

            for (const agent of agents) {
                await db.exec`
                    INSERT INTO agents (id, name, email, phone)
                    VALUES (${agent.id}, ${agent.name}, ${agent.email}, ${agent.phone})
                    ON CONFLICT (id) DO UPDATE SET
                        name = EXCLUDED.name,
                        email = EXCLUDED.email,
                        phone = EXCLUDED.phone
                `;
            }

            // Seed Listing
            const listings = [
                {
                    id: 'l1',
                    title: 'The Clifton Obsidian',
                    price: 285000000,
                    address: '52 Nettleton Road, Clifton, Cape Town',
                    description: 'Perched above the Atlantic Seaboard, this architectural masterpiece features floor-to-ceiling glass and an infinity pool.',
                    beds: 5,
                    baths: 6.5,
                    garage: 'Triple',
                    pool: 'private',
                    image_url: 'https://picsum.photos/id/164/1200/800',
                    agent_id: 'a1',
                    is_featured: true,
                    status: 'active',
                    is_pet_friendly: true,
                    viewing_type: 'appointment'
                }
            ];

            for (const l of listings) {
                await db.exec`
                    INSERT INTO listings (id, title, price, address, description, beds, baths, garage, pool, image_url, agent_id, is_featured, status, is_pet_friendly, viewing_type)
                    VALUES (${l.id}, ${l.title}, ${l.price}, ${l.address}, ${l.description}, ${l.beds}, ${l.baths}, ${l.garage}, ${l.pool}, ${l.image_url}, ${l.agent_id}, ${l.is_featured}, ${l.status}, ${l.is_pet_friendly}, ${l.viewing_type})
                    ON CONFLICT (id) DO UPDATE SET
                        title = EXCLUDED.title,
                        price = EXCLUDED.price,
                        address = EXCLUDED.address,
                        description = EXCLUDED.description,
                        beds = EXCLUDED.beds,
                        baths = EXCLUDED.baths,
                        garage = EXCLUDED.garage,
                        pool = EXCLUDED.pool,
                        image_url = EXCLUDED.image_url,
                        agent_id = EXCLUDED.agent_id,
                        is_featured = EXCLUDED.is_featured,
                        status = EXCLUDED.status,
                        is_pet_friendly = EXCLUDED.is_pet_friendly,
                        viewing_type = EXCLUDED.viewing_type
                `;
            }

            return { success: true, message: "Database seeded correctly with Victoria and Julian." };
        } catch (error) {
            console.error("Seed Error:", error);
            return { success: false, message: `Seed failed: ${error}` };
        }
    }
);

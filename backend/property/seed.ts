import { api } from "encore.dev/api";
import { db } from "./property";
import bcrypt from "bcryptjs";

/**
 * Comprehensive database seeding with realistic South African property data
 * Seeds: 1 agency, 3 agents, 5 listings, 1 conveyancer, 4 contractors, 4 test users
 */
export const seedDatabase = api(
    { expose: true, method: "POST", path: "/api/admin/seed-database" },
    async (): Promise<{ message: string; summary: any }> => {
        const now = new Date();
        const summary = {
            agencies: 0,
            agents: 0,
            listings: 0,
            conveyancers: 0,
            contractors: 0,
            users: 0,
        };

        try {
            // 1. Create Agency
            const agencyId = "ag_prestige_properties";
            const agencyExists = await db.queryRow`SELECT id FROM agencies WHERE id = ${agencyId}`;

            if (!agencyExists) {
                await db.exec`
                    INSERT INTO agencies (
                        id, name, registration_number, principal_name, office_address,
                        website, phone, email, description, logo_url,
                        service_areas, team_size, is_franchise, is_verified, created_at
                    ) VALUES (
                        ${agencyId},
                        'Prestige Properties Cape Town',
                        'PPRA-2024-8472',
                        'Michael Thompson',
                        '12 Kloof Street, Gardens, Cape Town, 8001',
                        'https://prestigeproperties.co.za',
                        '+27 21 424 5500',
                        'info@prestigeproperties.co.za',
                        'Cape Town''s premier luxury real estate agency, specializing in Atlantic Seaboard and City Bowl properties. Established 2010, with over R5 billion in annual sales.',
                        'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=400&fit=crop',
                        'Atlantic Seaboard, City Bowl, Southern Suburbs',
                        '15-25 agents',
                        false,
                        true,
                        ${now}
                    )
                `;
                summary.agencies++;
            }

            // 2. Create 3 Agents
            const agents = [
                {
                    id: 'agent_sarah_mitchell',
                    name: 'Sarah Mitchell',
                    email: 'sarah.mitchell@prestigeproperties.co.za',
                    phone: '+27 82 456 7890',
                    title: 'Senior Property Consultant',
                    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
                    sales: 'R850M Sold 2024',
                    agencyId: agencyId
                },
                {
                    id: 'agent_david_van_der_merwe',
                    name: 'David van der Merwe',
                    email: 'david.vdm@prestigeproperties.co.za',
                    phone: '+27 83 567 8901',
                    title: 'Luxury Property Specialist',
                    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
                    sales: 'R1.2B Sold 2024',
                    agencyId: agencyId
                },
                {
                    id: 'agent_priya_naidoo',
                    name: 'Priya Naidoo',
                    email: 'priya.naidoo@prestigeproperties.co.za',
                    phone: '+27 84 678 9012',
                    title: 'Property Consultant',
                    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop',
                    sales: 'R620M Sold 2024',
                    agencyId: agencyId
                }
            ];

            for (const agent of agents) {
                const exists = await db.queryRow`SELECT id FROM agents WHERE id = ${agent.id}`;
                if (!exists) {
                    await db.exec`
                        INSERT INTO agents (id, name, email, phone, title, image, sales, agency_id, created_at)
                        VALUES (
                            ${agent.id}, ${agent.name}, ${agent.email}, ${agent.phone},
                            ${agent.title}, ${agent.image}, ${agent.sales}, ${agent.agencyId}, ${now}
                        )
                    `;
                    summary.agents++;
                }
            }

            // 3. Create 5 Realistic Listings
            const listings = [
                {
                    id: 'listing_clifton_villa',
                    title: 'Clifton Beachfront Villa',
                    description: 'Spectacular 5-bedroom villa perched on the rocks of Clifton 2nd Beach. Floor-to-ceiling glass walls frame uninterrupted ocean views. Features include a 15m infinity pool, wine cellar, home cinema, and direct beach access. Architectural masterpiece by SAOTA.',
                    price: 89500000,
                    address: '24 Nettleton Road, Clifton, Cape Town',
                    beds: 5,
                    baths: 6,
                    garage: 'Triple Garage',
                    pool: 'private',
                    imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&h=800&fit=crop',
                    images: [
                        'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop',
                        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
                        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop'
                    ],
                    agentId: 'agent_david_van_der_merwe',
                    isFeatured: true,
                    status: 'active',
                    propertyType: 'House',
                    isPetFriendly: true,
                    viewingType: 'appointment',
                    onShowDate: null
                },
                {
                    id: 'listing_camps_bay_penthouse',
                    title: 'Camps Bay Luxury Penthouse',
                    description: 'Exclusive 3-bedroom penthouse in the prestigious The Sentinel building. Panoramic views of Camps Bay beach and the Twelve Apostles. Open-plan living with Miele appliances, underfloor heating, and two parking bays. Resort-style amenities including gym, spa, and concierge.',
                    price: 32500000,
                    address: 'The Sentinel, 12 Victoria Road, Camps Bay',
                    beds: 3,
                    baths: 3.5,
                    garage: 'Double Secure Parking',
                    pool: 'communal',
                    imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=800&fit=crop',
                    images: [
                        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
                        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop',
                        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop'
                    ],
                    agentId: 'agent_sarah_mitchell',
                    isFeatured: true,
                    status: 'active',
                    propertyType: 'Apartment',
                    isPetFriendly: false,
                    viewingType: 'appointment',
                    onShowDate: null
                },
                {
                    id: 'listing_constantia_estate',
                    title: 'Constantia Wine Estate Manor',
                    description: 'Historic 6-bedroom Cape Dutch manor on 5 hectares of pristine Constantia vineyards. Original features include yellowwood beams, Oregon pine floors, and a wine cellar dating to 1780. Separate 2-bedroom cottage, tennis court, and established gardens. Mountain and vineyard views.',
                    price: 47800000,
                    address: 'Constantia Main Road, Constantia, Cape Town',
                    beds: 6,
                    baths: 5,
                    garage: 'Quad Garage + Workshop',
                    pool: 'private',
                    imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=800&fit=crop',
                    images: [
                        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
                        'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop',
                        'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&h=600&fit=crop'
                    ],
                    agentId: 'agent_david_van_der_merwe',
                    isFeatured: false,
                    status: 'active',
                    propertyType: 'House',
                    isPetFriendly: true,
                    viewingType: 'appointment',
                    onShowDate: null
                },
                {
                    id: 'listing_waterfront_apartment',
                    title: 'V&A Waterfront Marina Apartment',
                    description: 'Sophisticated 2-bedroom apartment in the iconic Waterfront Marina. Wake up to yacht views and Table Mountain vistas. Modern finishes, Bosch appliances, and secure parking. Walk to world-class restaurants, shops, and entertainment. Perfect lock-up-and-go lifestyle.',
                    price: 8950000,
                    address: 'Waterfront Marina, V&A Waterfront, Cape Town',
                    beds: 2,
                    baths: 2,
                    garage: 'Single Secure Parking',
                    pool: 'communal',
                    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=800&fit=crop',
                    images: [
                        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
                        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
                        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'
                    ],
                    agentId: 'agent_priya_naidoo',
                    isFeatured: false,
                    status: 'active',
                    propertyType: 'Apartment',
                    isPetFriendly: true,
                    viewingType: 'on_show',
                    onShowDate: 'Sunday 14:00 - 16:00'
                },
                {
                    id: 'listing_sea_point_modern',
                    title: 'Sea Point Contemporary Home',
                    description: 'Newly renovated 4-bedroom home in prime Sea Point location. Smart home automation, solar panels, and borehole. Designer kitchen with Caesarstone counters, stacking doors to entertainer\'s patio with built-in braai. Walking distance to promenade and beaches.',
                    price: 15750000,
                    address: '45 High Level Road, Sea Point, Cape Town',
                    beds: 4,
                    baths: 3,
                    garage: 'Double Garage',
                    pool: 'none',
                    imageUrl: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&h=800&fit=crop',
                    images: [
                        'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop',
                        'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=600&fit=crop',
                        'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=800&h=600&fit=crop'
                    ],
                    agentId: 'agent_sarah_mitchell',
                    isFeatured: false,
                    status: 'active',
                    propertyType: 'House',
                    isPetFriendly: true,
                    viewingType: 'on_show',
                    onShowDate: 'Saturday 10:00 - 12:00'
                }
            ];

            for (const listing of listings) {
                const exists = await db.queryRow`SELECT id FROM listings WHERE id = ${listing.id}`;
                if (!exists) {
                    await db.exec`
                        INSERT INTO listings (
                            id, title, description, price, address, beds, baths, garage,
                            pool, image_url, images, agent_id, is_featured, status,
                            property_type, is_pet_friendly, viewing_type, on_show_date, created_at
                        ) VALUES (
                            ${listing.id}, ${listing.title}, ${listing.description}, ${listing.price},
                            ${listing.address}, ${listing.beds}, ${listing.baths}, ${listing.garage},
                            ${listing.pool}, ${listing.imageUrl}, ${listing.images}, ${listing.agentId},
                            ${listing.isFeatured}, ${listing.status}, ${listing.propertyType},
                            ${listing.isPetFriendly}, ${listing.viewingType}, ${listing.onShowDate}, ${now}
                        )
                    `;
                    summary.listings++;
                }
            }

            // 4. Create Conveyancer
            const conveyancers = [
                {
                    id: 'conv_adams_attorneys',
                    name: 'Adams & Associates Conveyancers',
                    specialist: 'Residential & Commercial Transfers',
                    location: 'Cape Town CBD',
                    rating: 4.8,
                    imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=400&fit=crop',
                    website: 'https://adamsconveyancers.co.za',
                    phone: '+27 21 418 3300',
                    isVerified: true,
                }
            ];

            for (const conv of conveyancers) {
                const exists = await db.queryRow`SELECT id FROM conveyancers WHERE id = ${conv.id}`;
                if (!exists) {
                    await db.exec`
                        INSERT INTO conveyancers (id, name, specialist, location, rating, image_url, website, phone, is_verified, created_at)
                        VALUES (${conv.id}, ${conv.name}, ${conv.specialist}, ${conv.location}, ${conv.rating}, ${conv.imageUrl}, ${conv.website}, ${conv.phone}, ${conv.isVerified}, ${now})
                    `;
                    summary.conveyancers++;
                }
            }

            // 5. Create Contractors
            const contractors = [
                {
                    id: 'contractor_plumb_pro',
                    name: 'PlumbPro Cape Town',
                    trade: 'Plumbing',
                    location: 'Cape Town Metro',
                    rating: 4.9,
                    imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=400&fit=crop',
                    phone: '+27 82 555 1234',
                    email: 'info@plumbpro.co.za',
                    description: 'Licensed master plumbers with 15+ years experience. 24/7 emergency services. Specializing in geyser installations, leak detection, and bathroom renovations.',
                    isVerified: true,
                    hourlyRate: 450,
                },
                {
                    id: 'contractor_spark_electric',
                    name: 'Spark Electrical Services',
                    trade: 'Electrical',
                    location: 'Atlantic Seaboard',
                    rating: 4.7,
                    imageUrl: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=400&fit=crop',
                    phone: '+27 83 666 2345',
                    email: 'bookings@sparkelectric.co.za',
                    description: 'Registered electricians providing COC certificates, solar installations, load shedding solutions, and smart home wiring.',
                    isVerified: true,
                    hourlyRate: 500,
                },
                {
                    id: 'contractor_build_right',
                    name: 'BuildRight Construction',
                    trade: 'General Construction',
                    location: 'Southern Suburbs',
                    rating: 4.6,
                    imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=400&fit=crop',
                    phone: '+27 84 777 3456',
                    email: 'projects@buildright.co.za',
                    description: 'Full-service building contractor. Extensions, renovations, new builds. NHBRC registered. Free quotes within 48 hours.',
                    isVerified: true,
                    hourlyRate: 650,
                },
                {
                    id: 'contractor_paint_masters',
                    name: 'Paint Masters SA',
                    trade: 'Painting',
                    location: 'Cape Town Metro',
                    rating: 4.8,
                    imageUrl: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400&h=400&fit=crop',
                    phone: '+27 85 888 4567',
                    email: 'quote@paintmasters.co.za',
                    description: 'Professional painters for interior and exterior. Waterproofing, damp proofing, and decorative finishes. Dulux approved applicators.',
                    isVerified: true,
                    hourlyRate: 380,
                }
            ];

            for (const contractor of contractors) {
                const exists = await db.queryRow`SELECT id FROM contractors WHERE id = ${contractor.id}`;
                if (!exists) {
                    await db.exec`
                        INSERT INTO contractors (id, name, trade, location, rating, image_url, phone, email, description, is_verified, hourly_rate, created_at)
                        VALUES (${contractor.id}, ${contractor.name}, ${contractor.trade}, ${contractor.location}, ${contractor.rating}, ${contractor.imageUrl}, ${contractor.phone}, ${contractor.email}, ${contractor.description}, ${contractor.isVerified}, ${contractor.hourlyRate}, ${now})
                    `;
                    summary.contractors++;
                }
            }

            // 6. Create Test Users with known credentials
            // Password for all test users: Test1234!
            const testPassword = 'Test1234!';
            const passwordHash = await bcrypt.hash(testPassword, 12);

            const testUsers = [
                {
                    id: 'user_admin_test',
                    email: 'admin@showhouse.co.za',
                    role: 'ADMIN',
                    firstName: 'Admin',
                    lastName: 'User',
                    phone: '+27 21 000 0001',
                    isVerified: true,
                    agentId: null,
                    contractorId: null,
                    agencyId: null,
                },
                {
                    id: 'user_agent_test',
                    email: 'agent@showhouse.co.za',
                    role: 'AGENT',
                    firstName: 'Test',
                    lastName: 'Agent',
                    phone: '+27 21 000 0002',
                    isVerified: true,
                    agentId: 'agent_sarah_mitchell',
                    contractorId: null,
                    agencyId: null,
                },
                {
                    id: 'user_agency_test',
                    email: 'agency@showhouse.co.za',
                    role: 'AGENCY',
                    firstName: 'Test',
                    lastName: 'Agency',
                    phone: '+27 21 000 0003',
                    isVerified: true,
                    agentId: null,
                    contractorId: null,
                    agencyId: 'ag_prestige_properties',
                },
                {
                    id: 'user_contractor_test',
                    email: 'contractor@showhouse.co.za',
                    role: 'CONTRACTOR',
                    firstName: 'Test',
                    lastName: 'Contractor',
                    phone: '+27 21 000 0004',
                    isVerified: true,
                    agentId: null,
                    contractorId: 'contractor_plumb_pro',
                    agencyId: null,
                }
            ];

            for (const user of testUsers) {
                const exists = await db.queryRow`SELECT id FROM users WHERE id = ${user.id} OR email = ${user.email}`;
                if (!exists) {
                    await db.exec`
                        INSERT INTO users (id, email, password_hash, role, first_name, last_name, phone, is_verified, is_active, agent_id, contractor_id, agency_id, created_at, updated_at)
                        VALUES (${user.id}, ${user.email}, ${passwordHash}, ${user.role}, ${user.firstName}, ${user.lastName}, ${user.phone}, ${user.isVerified}, true, ${user.agentId}, ${user.contractorId}, ${user.agencyId}, ${now}, ${now})
                    `;
                    summary.users++;
                }
            }

            return {
                message: "Database seeded successfully!",
                summary: {
                    ...summary,
                    note: "Existing records were skipped to prevent duplicates"
                }
            };

        } catch (error: any) {
            console.error("Seeding error:", error);
            // Return the error message to help debugging
            return {
                message: "Failed to seed database",
                summary: {
                    error: error.message,
                    stack: error.stack
                }
            };
        }
    }
);

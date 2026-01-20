-- 1. Agency
INSERT INTO agencies (
    id, name, registration_number, principal_name, office_address,
    website, phone, email, description, logo_url,
    service_areas, team_size, is_franchise, is_verified, created_at
) 
SELECT 
    'ag_prestige_properties',
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
    NOW()
WHERE NOT EXISTS (SELECT 1 FROM agencies WHERE id = 'ag_prestige_properties');

-- 2. Agents
INSERT INTO agents (id, name, email, phone, title, image, sales, agency_id, created_at)
SELECT 'agent_sarah_mitchell', 'Sarah Mitchell', 'sarah.mitchell@prestigeproperties.co.za', '+27 82 456 7890', 'Senior Property Consultant', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop', 'R850M Sold 2024', 'ag_prestige_properties', NOW()
WHERE NOT EXISTS (SELECT 1 FROM agents WHERE id = 'agent_sarah_mitchell');

INSERT INTO agents (id, name, email, phone, title, image, sales, agency_id, created_at)
SELECT 'agent_david_van_der_merwe', 'David van der Merwe', 'david.vdm@prestigeproperties.co.za', '+27 83 567 8901', 'Luxury Property Specialist', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop', 'R1.2B Sold 2024', 'ag_prestige_properties', NOW()
WHERE NOT EXISTS (SELECT 1 FROM agents WHERE id = 'agent_david_van_der_merwe');

INSERT INTO agents (id, name, email, phone, title, image, sales, agency_id, created_at)
SELECT 'agent_priya_naidoo', 'Priya Naidoo', 'priya.naidoo@prestigeproperties.co.za', '+27 84 678 9012', 'Property Consultant', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop', 'R620M Sold 2024', 'ag_prestige_properties', NOW()
WHERE NOT EXISTS (SELECT 1 FROM agents WHERE id = 'agent_priya_naidoo');

-- 3. Listings
INSERT INTO listings (
    id, title, description, price, address, beds, baths, garage,
    pool, image_url, images, agent_id, is_featured, status,
    property_type, is_pet_friendly, viewing_type, on_show_date, created_at
) 
SELECT 
    'listing_clifton_villa', 'Clifton Beachfront Villa', 'Spectacular 5-bedroom villa perched on the rocks of Clifton 2nd Beach. Floor-to-ceiling glass walls frame uninterrupted ocean views. Features include a 15m infinity pool, wine cellar, home cinema, and direct beach access. Architectural masterpiece by SAOTA.', 89500000, '24 Nettleton Road, Clifton, Cape Town', 5, 6, 'Triple Garage',
    'private', 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&h=800&fit=crop', ARRAY['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop'], 'agent_david_van_der_merwe', true, 'active',
    'House', true, 'appointment', null, NOW()
WHERE NOT EXISTS (SELECT 1 FROM listings WHERE id = 'listing_clifton_villa');

INSERT INTO listings (
    id, title, description, price, address, beds, baths, garage,
    pool, image_url, images, agent_id, is_featured, status,
    property_type, is_pet_friendly, viewing_type, on_show_date, created_at
) 
SELECT 
    'listing_camps_bay_penthouse', 'Camps Bay Luxury Penthouse', 'Exclusive 3-bedroom penthouse in the prestigious The Sentinel building. Panoramic views of Camps Bay beach and the Twelve Apostles. Open-plan living with Miele appliances, underfloor heating, and two parking bays. Resort-style amenities including gym, spa, and concierge.', 32500000, 'The Sentinel, 12 Victoria Road, Camps Bay', 3, 3.5, 'Double Secure Parking',
    'communal', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=800&fit=crop', ARRAY['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop'], 'agent_sarah_mitchell', true, 'active',
    'Apartment', false, 'appointment', null, NOW()
WHERE NOT EXISTS (SELECT 1 FROM listings WHERE id = 'listing_camps_bay_penthouse');

INSERT INTO listings (
    id, title, description, price, address, beds, baths, garage,
    pool, image_url, images, agent_id, is_featured, status,
    property_type, is_pet_friendly, viewing_type, on_show_date, created_at
) 
SELECT 
    'listing_constantia_estate', 'Constantia Wine Estate Manor', 'Historic 6-bedroom Cape Dutch manor on 5 hectares of pristine Constantia vineyards. Original features include yellowwood beams, Oregon pine floors, and a wine cellar dating to 1780. Separate 2-bedroom cottage, tennis court, and established gardens. Mountain and vineyard views.', 47800000, 'Constantia Main Road, Constantia, Cape Town', 6, 5, 'Quad Garage + Workshop',
    'private', 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=800&fit=crop', ARRAY['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&h=600&fit=crop'], 'agent_david_van_der_merwe', false, 'active',
    'House', true, 'appointment', null, NOW()
WHERE NOT EXISTS (SELECT 1 FROM listings WHERE id = 'listing_constantia_estate');

INSERT INTO listings (
    id, title, description, price, address, beds, baths, garage,
    pool, image_url, images, agent_id, is_featured, status,
    property_type, is_pet_friendly, viewing_type, on_show_date, created_at
) 
SELECT 
    'listing_waterfront_apartment', 'V&A Waterfront Marina Apartment', 'Sophisticated 2-bedroom apartment in the iconic Waterfront Marina. Wake up to yacht views and Table Mountain vistas. Modern finishes, Bosch appliances, and secure parking. Walk to world-class restaurants, shops, and entertainment. Perfect lock-up-and-go lifestyle.', 8950000, 'Waterfront Marina, V&A Waterfront, Cape Town', 2, 2, 'Single Secure Parking',
    'communal', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=800&fit=crop', ARRAY['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'], 'agent_priya_naidoo', false, 'active',
    'Apartment', true, 'on_show', 'Sunday 14:00 - 16:00', NOW()
WHERE NOT EXISTS (SELECT 1 FROM listings WHERE id = 'listing_waterfront_apartment');

INSERT INTO listings (
    id, title, description, price, address, beds, baths, garage,
    pool, image_url, images, agent_id, is_featured, status,
    property_type, is_pet_friendly, viewing_type, on_show_date, created_at
) 
SELECT 
    'listing_sea_point_modern', 'Sea Point Contemporary Home', 'Newly renovated 4-bedroom home in prime Sea Point location. Smart home automation, solar panels, and borehole. Designer kitchen with Caesarstone counters, stacking doors to entertainer''s patio with built-in braai. Walking distance to promenade and beaches.', 15750000, '45 High Level Road, Sea Point, Cape Town', 4, 3, 'Double Garage',
    'none', 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&h=800&fit=crop', ARRAY['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=800&h=600&fit=crop'], 'agent_sarah_mitchell', false, 'active',
    'House', true, 'on_show', 'Saturday 10:00 - 12:00', NOW()
WHERE NOT EXISTS (SELECT 1 FROM listings WHERE id = 'listing_sea_point_modern');


-- Add missing tables for Mandated Property Group

-- Inquiries
CREATE TABLE IF NOT EXISTS inquiries (
    id TEXT PRIMARY KEY,
    listing_id TEXT REFERENCES listings(id) ON DELETE SET NULL,
    agent_id TEXT REFERENCES agents(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Virtual Tours
CREATE TABLE IF NOT EXISTS virtual_tours (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    agent_id TEXT REFERENCES agents(id) ON DELETE CASCADE,
    listing_id TEXT REFERENCES listings(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'draft',
    voice_uri TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tour Stops (Items within a tour)
CREATE TABLE IF NOT EXISTS tour_stops (
    id TEXT PRIMARY KEY,
    tour_id TEXT NOT NULL REFERENCES virtual_tours(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contractors
CREATE TABLE IF NOT EXISTS contractors (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    trade TEXT NOT NULL,
    location TEXT NOT NULL,
    rating NUMERIC(3,2) DEFAULT 0,
    image_url TEXT,
    phone TEXT,
    email TEXT,
    description TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    hourly_rate INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conveyancers
CREATE TABLE IF NOT EXISTS conveyancers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    specialist TEXT NOT NULL,
    location TEXT NOT NULL,
    rating NUMERIC(3,2) DEFAULT 0,
    image_url TEXT,
    website TEXT,
    phone TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing columns to listings if not present (the first migration might have been simple)
ALTER TABLE listings ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS images TEXT[]; -- Postgres array
ALTER TABLE listings ADD COLUMN IF NOT EXISTS agent_id TEXT REFERENCES agents(id) ON DELETE SET NULL;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE listings ADD COLUMN IF NOT EXISTS on_show_date TEXT;

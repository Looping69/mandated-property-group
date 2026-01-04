-- Migration: Add users table and missing fields for agents
-- This supports the role-based system (AGENT, AGENCY, CONTRACTOR)

-- Users table - Links Clerk users to their roles and registration data
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY, -- Clerk user ID
    clerk_id TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('AGENT', 'AGENCY', 'CONTRACTOR')),
    
    -- Common fields
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    image_url TEXT,
    
    -- Link to role-specific data
    agent_id TEXT REFERENCES agents(id) ON DELETE SET NULL,
    contractor_id TEXT REFERENCES contractors(id) ON DELETE SET NULL,
    
    -- Metadata
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing columns to agents table for full registration data
ALTER TABLE agents ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS sales TEXT;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS areas TEXT;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS ppra_number TEXT;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS agency TEXT;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;

-- Agencies table (for AGENCY role)
CREATE TABLE IF NOT EXISTS agencies (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    registration_number TEXT UNIQUE,
    principal_name TEXT,
    office_address TEXT,
    website TEXT,
    phone TEXT,
    email TEXT UNIQUE,
    description TEXT,
    logo_url TEXT,
    service_areas TEXT,
    team_size TEXT,
    is_franchise BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add agency_id column to agents for linking agents to agencies
ALTER TABLE agents ADD COLUMN IF NOT EXISTS agency_id TEXT REFERENCES agencies(id) ON DELETE SET NULL;

-- Maintenance requests table
CREATE TABLE IF NOT EXISTS maintenance_requests (
    id TEXT PRIMARY KEY,
    listing_id TEXT REFERENCES listings(id) ON DELETE SET NULL,
    contractor_id TEXT REFERENCES contractors(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'in_progress', 'completed', 'cancelled')),
    category TEXT NOT NULL,
    reported_by TEXT NOT NULL, -- User ID who created it
    assigned_to TEXT REFERENCES contractors(id) ON DELETE SET NULL,
    images TEXT[],
    estimated_cost INTEGER,
    actual_cost INTEGER,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add property type columns that might be missing
ALTER TABLE listings ADD COLUMN IF NOT EXISTS property_type TEXT DEFAULT 'House';
ALTER TABLE listings ADD COLUMN IF NOT EXISTS is_pet_friendly BOOLEAN DEFAULT FALSE;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS viewing_type TEXT DEFAULT 'appointment';
ALTER TABLE listings ADD COLUMN IF NOT EXISTS garage TEXT DEFAULT 'None';
ALTER TABLE listings ADD COLUMN IF NOT EXISTS pool TEXT DEFAULT 'none';

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_maintenance_status ON maintenance_requests(status);
CREATE INDEX IF NOT EXISTS idx_maintenance_contractor ON maintenance_requests(contractor_id);
CREATE INDEX IF NOT EXISTS idx_agents_agency ON agents(agency_id);

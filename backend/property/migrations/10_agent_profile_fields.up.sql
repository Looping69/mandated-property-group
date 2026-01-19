-- Migration: Add missing agent fields for full agent profiles
-- Adds title, image, sales, and agency_id columns to agents table

ALTER TABLE agents ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS image TEXT;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS sales TEXT;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS agency_id TEXT REFERENCES agencies(id) ON DELETE SET NULL;

-- Create index for agency_id lookups
CREATE INDEX IF NOT EXISTS idx_agents_agency_id ON agents(agency_id);

-- Migration: Update user roles and add agency_id
-- Adds BROWSER and ADMIN roles and links users to agencies directly

-- Update role check constraint
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('BROWSER', 'AGENT', 'AGENCY', 'CONTRACTOR', 'ADMIN'));

-- Add agency_id to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS agency_id TEXT REFERENCES agencies(id) ON DELETE SET NULL;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_agency_id ON users(agency_id);

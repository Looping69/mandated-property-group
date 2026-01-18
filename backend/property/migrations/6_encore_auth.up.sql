-- Migration: Add auth fields and sessions table for Encore Auth
-- This replaces Clerk-based authentication

-- Add password_hash to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- Create sessions table
CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for user_id in sessions
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);

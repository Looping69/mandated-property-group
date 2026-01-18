-- Migration: Make clerk_id nullable in users table
-- This is necessary for seeds and domestic auth users who don't have a Clerk ID.

ALTER TABLE users ALTER COLUMN clerk_id DROP NOT NULL;

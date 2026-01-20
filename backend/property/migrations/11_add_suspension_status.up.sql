ALTER TABLE agents ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE agencies ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE contractors ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
-- Listings already has status, we will just use 'suspended' as a value.

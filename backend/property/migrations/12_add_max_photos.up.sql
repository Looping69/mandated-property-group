-- Migration: Add max_photos to packages table

ALTER TABLE packages ADD COLUMN max_photos INTEGER NOT NULL DEFAULT 5;

-- Update agency-level packages with higher limits
UPDATE packages SET max_photos = 15 WHERE slug = 'local-presence';
UPDATE packages SET max_photos = 25 WHERE slug = 'area-authority';
UPDATE packages SET max_photos = 40 WHERE slug = 'market-leader';
UPDATE packages SET max_photos = 60 WHERE slug = 'regional-dominance';

-- Update the solo 5 pack specifically
UPDATE packages SET max_photos = 10 WHERE slug = 'solo-entry-5';

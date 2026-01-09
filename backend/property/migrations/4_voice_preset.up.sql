-- Add voice_preset column for Google Cloud TTS integration
-- This column stores the premium voice preset (JAMES or OLIVIA)

ALTER TABLE virtual_tours ADD COLUMN IF NOT EXISTS voice_preset TEXT DEFAULT NULL;

-- Add audio_url column to tour_stops for pre-generated TTS audio
-- This stores base64 data URLs of the audio files
ALTER TABLE tour_stops ADD COLUMN IF NOT EXISTS audio_url TEXT DEFAULT NULL;

-- Add comments for documentation
COMMENT ON COLUMN virtual_tours.voice_preset IS 'Google Cloud TTS voice preset: JAMES (warm male) or OLIVIA (warm female)';
COMMENT ON COLUMN tour_stops.audio_url IS 'Pre-generated TTS audio as base64 data URL';

-- Add tts_cache table to avoid re-synthesizing the same text
-- This saves on API costs and improves performance

CREATE TABLE IF NOT EXISTS tts_cache (
    id TEXT PRIMARY KEY, -- SHA-256 hash of (text + voice + config)
    text TEXT NOT NULL,
    voice_preset TEXT NOT NULL,
    audio_content TEXT NOT NULL, -- Base64 encoded MP3
    duration_ms INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for cleanup or reporting if needed
CREATE INDEX IF NOT EXISTS idx_tts_cache_created_at ON tts_cache(created_at);

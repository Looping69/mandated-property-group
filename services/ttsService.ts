/**
 * Text-to-Speech Service
 * Integrates with Google Cloud TTS backend for premium voice synthesis
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Voice presets matching backend configuration
export type VoicePreset = 'JAMES' | 'OLIVIA';

export interface VoiceInfo {
    name: string;
    languageCode: string;
    ssmlGender: 'MALE' | 'FEMALE';
    displayName: string;
    description: string;
}

export interface SynthesizeResponse {
    audioContent: string; // Base64 MP3
    durationMs: number;
}

export interface BatchSynthesizeResponse {
    audioFiles: Array<{
        stopId: string;
        audioContent: string;
        durationMs: number;
    }>;
}

// Friendly voice metadata for UI display
export const VOICE_OPTIONS: Record<VoicePreset, VoiceInfo> = {
    JAMES: {
        name: 'en-GB-Neural2-B',
        languageCode: 'en-GB',
        ssmlGender: 'MALE',
        displayName: 'James',
        description: 'Warm, authoritative British male voice',
    },
    OLIVIA: {
        name: 'en-GB-Neural2-F',
        languageCode: 'en-GB',
        ssmlGender: 'FEMALE',
        displayName: 'Olivia',
        description: 'Warm, intimate British female voice',
    },
};

/**
 * Synthesize speech for a single text
 */
export async function synthesizeSpeech(
    text: string,
    voicePreset: VoicePreset = 'OLIVIA',
    speakingRate?: number,
    pitch?: number
): Promise<SynthesizeResponse> {
    const res = await fetch(`${API_BASE}/api/tts/synthesize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            text,
            voicePreset,
            speakingRate,
            pitch,
        }),
    });

    if (!res.ok) {
        throw new Error(`TTS synthesis failed: ${res.statusText}`);
    }

    return res.json();
}

/**
 * Synthesize speech for multiple tour stops in batch
 */
export async function synthesizeBatch(
    stops: Array<{ id: string; text: string }>,
    voicePreset: VoicePreset = 'OLIVIA'
): Promise<BatchSynthesizeResponse> {
    const res = await fetch(`${API_BASE}/api/tts/synthesize-batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            stops,
            voicePreset,
        }),
    });

    if (!res.ok) {
        throw new Error(`TTS batch synthesis failed: ${res.statusText}`);
    }

    return res.json();
}

/**
 * Get available voice presets from server
 */
export async function getAvailableVoices(): Promise<Record<VoicePreset, VoiceInfo>> {
    try {
        const res = await fetch(`${API_BASE}/api/tts/voices`);
        if (!res.ok) {
            console.warn('Failed to fetch voices from server, using local defaults');
            return VOICE_OPTIONS;
        }
        const data = await res.json();
        return data.voices;
    } catch {
        return VOICE_OPTIONS;
    }
}

/**
 * Convert base64 audio to an Audio element for playback
 */
export function createAudioFromBase64(base64Audio: string): HTMLAudioElement {
    const audio = new Audio();
    audio.src = `data:audio/mp3;base64,${base64Audio}`;
    return audio;
}

/**
 * Play base64 audio and return a promise that resolves when done
 */
export function playAudio(base64Audio: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const audio = createAudioFromBase64(base64Audio);
        audio.onended = () => resolve();
        audio.onerror = (e) => reject(e);
        audio.play().catch(reject);
    });
}

/**
 * Cache for synthesized audio to avoid re-requesting
 */
const audioCache = new Map<string, string>();

export function getCacheKey(text: string, voice: VoicePreset): string {
    return `${voice}:${text.slice(0, 50)}`;
}

export function getCachedAudio(text: string, voice: VoicePreset): string | undefined {
    return audioCache.get(getCacheKey(text, voice));
}

export function setCachedAudio(text: string, voice: VoicePreset, audioBase64: string): void {
    audioCache.set(getCacheKey(text, voice), audioBase64);
}

export function clearAudioCache(): void {
    audioCache.clear();
}

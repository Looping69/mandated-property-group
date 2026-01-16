import { api } from "encore.dev/api";
import { secret } from "encore.dev/config";
import { TextToSpeechClient, protos } from "@google-cloud/text-to-speech";

// Google Cloud credentials as a JSON string in the secret
const googleCredentials = secret("GoogleCloudCredentials");

let ttsClient: TextToSpeechClient | null = null;
const getTTSClient = () => {
    if (!ttsClient) {
        const creds = googleCredentials();
        if (!creds || creds === "") {
            throw new Error("GoogleCloudCredentials secret is not set. Please set it using 'encore secret set GoogleCloudCredentials'");
        }

        try {
            const credentials = JSON.parse(creds);
            ttsClient = new TextToSpeechClient({
                credentials: credentials,
            });
        } catch (e) {
            throw new Error("Failed to parse GoogleCloudCredentials secret as JSON. Ensure it is a valid service account key string.");
        }
    }
    return ttsClient;
};

// --- Voice Presets ---
// Curated warm, intimate voices for luxury property tours
export const TOUR_VOICES = {
    JAMES: {
        name: "en-GB-Neural2-B",
        languageCode: "en-GB",
        ssmlGender: "MALE" as const,
        displayName: "James",
        description: "Warm, authoritative British male",
    },
    OLIVIA: {
        name: "en-GB-Neural2-F",
        languageCode: "en-GB",
        ssmlGender: "FEMALE" as const,
        displayName: "Olivia",
        description: "Warm, intimate British female",
    },
} as const;

export type VoicePreset = keyof typeof TOUR_VOICES;

// --- Types ---
interface SynthesizeSpeechParams {
    text: string;
    voicePreset: VoicePreset;
    speakingRate?: number; // 0.25 to 4.0, default 0.95 (slightly slower for luxury feel)
    pitch?: number; // -20.0 to 20.0 semitones, default 0
}

interface SynthesizeSpeechResponse {
    audioContent: string; // Base64 encoded MP3
    durationMs: number;
}

// --- API Endpoints ---

/**
 * Get available tour voice presets
 */
export const getVoices = api(
    { expose: true, method: "GET", path: "/api/tts/voices" },
    async (): Promise<{ voices: typeof TOUR_VOICES }> => {
        return { voices: TOUR_VOICES };
    }
);

/**
 * Synthesize speech for virtual tour narration
 * Returns base64 encoded MP3 audio
 */
export const synthesize = api(
    { expose: true, method: "POST", path: "/api/tts/synthesize" },
    async (params: SynthesizeSpeechParams): Promise<SynthesizeSpeechResponse> => {
        try {
            const client = getTTSClient();
            const voiceConfig = TOUR_VOICES[params.voicePreset];

            if (!voiceConfig) {
                throw new Error(`Invalid voice preset: ${params.voicePreset}`);
            }

            // Build the request with SSML for more natural delivery
            const ssml = buildSSML(params.text);

            const request = {
                input: { ssml },
                voice: {
                    languageCode: voiceConfig.languageCode,
                    name: voiceConfig.name,
                    ssmlGender: voiceConfig.ssmlGender,
                },
                audioConfig: {
                    audioEncoding: "MP3" as const,
                    speakingRate: params.speakingRate ?? 0.92, // Slightly slower for luxury feel
                    pitch: params.pitch ?? -1.0, // Slightly deeper for warmth
                    // Audio profile optimized for headphones/speakers
                    effectsProfileId: ["headphone-class-device"],
                },
            };

            const [response] = await client.synthesizeSpeech(request);

            if (!response.audioContent) {
                throw new Error("No audio content returned from TTS");
            }

            // Convert to base64
            const audioBase64 = Buffer.isBuffer(response.audioContent)
                ? response.audioContent.toString("base64")
                : Buffer.from(response.audioContent).toString("base64");

            // Estimate duration (rough: ~150 words per minute, ~5 chars per word)
            const wordCount = params.text.split(/\s+/).length;
            const durationMs = Math.round((wordCount / 150) * 60 * 1000);

            return {
                audioContent: audioBase64,
                durationMs,
            };
        } catch (error) {
            console.error("TTS Synthesize Error:", error);
            throw error;
        }
    }
);

/**
 * Synthesize speech for multiple tour stops in batch
 * More efficient for generating a full tour
 */
export const synthesizeBatch = api(
    { expose: true, method: "POST", path: "/api/tts/synthesize-batch" },
    async (params: {
        stops: Array<{ id: string; text: string }>;
        voicePreset: VoicePreset
    }): Promise<{
        audioFiles: Array<{ stopId: string; audioContent: string; durationMs: number }>
    }> => {
        const client = getTTSClient();
        const voiceConfig = TOUR_VOICES[params.voicePreset];

        if (!voiceConfig) {
            throw new Error(`Invalid voice preset: ${params.voicePreset}`);
        }

        const audioFiles = await Promise.all(
            params.stops.map(async (stop) => {
                const ssml = buildSSML(stop.text);

                const request = {
                    input: { ssml },
                    voice: {
                        languageCode: voiceConfig.languageCode,
                        name: voiceConfig.name,
                        ssmlGender: voiceConfig.ssmlGender,
                    },
                    audioConfig: {
                        audioEncoding: "MP3" as const,
                        speakingRate: 0.92,
                        pitch: -1.0,
                        effectsProfileId: ["headphone-class-device"],
                    },
                };

                const [response] = await client.synthesizeSpeech(request);

                const audioBase64 = Buffer.isBuffer(response.audioContent)
                    ? response.audioContent!.toString("base64")
                    : Buffer.from(response.audioContent!).toString("base64");

                const wordCount = stop.text.split(/\s+/).length;
                const durationMs = Math.round((wordCount / 150) * 60 * 1000);

                return {
                    stopId: stop.id,
                    audioContent: audioBase64,
                    durationMs,
                };
            })
        );

        return { audioFiles };
    }
);

/**
 * Build SSML markup for more natural speech delivery
 * Adds appropriate pauses and emphasis for luxury property narration
 */
function buildSSML(text: string): string {
    // Add a slight pause at the start for natural introduction
    // Add emphasis on key luxury words
    const luxuryWords = [
        "exquisite", "bespoke", "pristine", "breathtaking", "magnificent",
        "stunning", "luxurious", "elegant", "sophisticated", "exceptional",
        "exclusive", "premium", "masterpiece", "sanctuary", "retreat"
    ];

    let processedText = text;

    // Wrap luxury words with emphasis
    luxuryWords.forEach(word => {
        const regex = new RegExp(`\\b(${word})\\b`, 'gi');
        processedText = processedText.replace(regex, '<emphasis level="moderate">$1</emphasis>');
    });

    // Add natural pauses after sentences
    processedText = processedText.replace(/\.\s/g, '.<break time="400ms"/> ');
    processedText = processedText.replace(/,\s/g, ',<break time="150ms"/> ');

    return `<speak>
        <prosody rate="95%" pitch="-1st">
            <break time="300ms"/>
            ${processedText}
            <break time="500ms"/>
        </prosody>
    </speak>`;
}

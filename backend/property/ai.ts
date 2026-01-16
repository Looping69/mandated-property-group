
import { api } from "encore.dev/api";
import { secret } from "encore.dev/config";
import { GoogleGenAI } from "@google/genai";

const apiKey = secret("GEMINI_API_KEY");

let genAI: GoogleGenAI | null = null;
const getAI = () => {
    if (!genAI) {
        const key = apiKey();
        if (!key || key === "") {
            throw new Error("CRITICAL: GEMINI_API_KEY secret is empty or not configured correctly.");
        }
        genAI = new GoogleGenAI({ apiKey: key });
    }
    return genAI;
};

export const generateDescription = api(
    { expose: true, method: "POST", path: "/api/ai/generate-description" },
    async ({ features }: { features: string }): Promise<{ description: string }> => {
        try {
            const ai = getAI();
            const result = await ai.models.generateContent({
                model: "gemini-2.0-flash",
                contents: `Write a luxurious, captivating real estate listing description (approx 80 words) for a high-end South African home with these features: ${features}. Use British English spelling (e.g., 'centre', 'colour'). Use evocative language suitable for high-net-worth buyers in areas like Clifton, Sandton, or the Winelands.`,
            });

            return { description: result.text || "Description unavailable." };
        } catch (error) {
            console.error("Gemini Generate Description Error:", error);
            throw error;
        }
    }
);

export const analyzeTourImage = api(
    { expose: true, method: "POST", path: "/api/ai/analyze-tour-image" },
    async ({ image, context }: { image: string, context: string }): Promise<{ title: string; script: string }> => {
        try {
            const ai = getAI();

            // image is base64
            const result = await ai.models.generateContent({
                model: "gemini-2.0-flash",
                contents: {
                    parts: [
                        {
                            inlineData: {
                                mimeType: "image/jpeg",
                                data: image
                            }
                        },
                        {
                            text: `You are an elite real estate agent in South Africa giving a virtual tour.
                Context provided by agent: "${context}".
                1. Identify the room or key feature in this image.
                2. Write a short, spoken-word script (2-3 sentences) selling this feature to a luxury buyer. Use British/South African English nuances where appropriate (e.g., 'braai room' if it looks like an indoor BBQ area, or 'verandah').
                
                Return JSON with keys: "title" (the room name) and "script" (the spoken commentary).`
                        }
                    ]
                },
            });

            const text = result.text;
            if (!text) return { title: "Room Analysis", script: "Exquisite details can be seen throughout." };

            const jsonMatch = text.match(/\{[\s\S]*\}/);
            const jsonStr = jsonMatch ? jsonMatch[0] : text;
            return JSON.parse(jsonStr);
        } catch (error) {
            console.error("Gemini Analyze Tour Image Error:", error);
            throw error;
        }
    }
);

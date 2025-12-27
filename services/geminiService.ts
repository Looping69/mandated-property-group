
import { apiRequest } from './apiConfig';

/**
 * Generates a high-end marketing description for a property based on features via the backend AI service.
 */
export const generatePropertyDescription = async (features: string): Promise<string> => {
  try {
    const response = await apiRequest<{ description: string }>('/ai/generate-description', {
      method: 'POST',
      body: JSON.stringify({ features }),
    });
    return response.description;
  } catch (error) {
    console.error("AI Generation Error:", error);
    return "Unable to generate description at this time.";
  }
};

/**
 * Analyzes an image (virtual tour stop) and generates an agent script/commentary via the backend AI service.
 */
export const analyzeTourImage = async (base64Image: string, context: string): Promise<{ title: string; script: string }> => {
  try {
    return await apiRequest<{ title: string; script: string }>('/ai/analyze-tour-image', {
      method: 'POST',
      body: JSON.stringify({ image: base64Image, context }),
    });
  } catch (error) {
    console.error("Tour Analysis Error:", error);
    return {
      title: "Analysis Unavailable",
      script: "I'm having trouble analyzing this view right now, but notice the exquisite attention to detail in this space."
    };
  }
};

// Helper to convert file to base64 remains the same
export const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

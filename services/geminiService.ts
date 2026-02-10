
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ImageResolution } from "../types";

export const generateImageWithGemini = async (
  originalImage: string | null,
  referenceImages: (string | null)[],
  prompt: string,
  resolution: ImageResolution
): Promise<string> => {
  try {
    // Always create a new GoogleGenAI instance right before making an API call 
    // to ensure it uses the most up-to-date API key from the environment.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Determine the best model and config based on resolution
    let modelName = 'gemini-2.5-flash-image';
    let aspectRatio: "1:1" | "9:16" | "16:9" | "3:4" | "4:3" = "1:1";
    let imageSize: "1K" | "2K" | "4K" | undefined = undefined;

    switch (resolution) {
      case "1024x1024":
        aspectRatio = "1:1";
        break;
      case "1080x1920":
        aspectRatio = "9:16";
        break;
      case "2160x2160":
        // Upgrade to gemini-3-pro-image-preview for high-res support
        modelName = 'gemini-3-pro-image-preview';
        aspectRatio = "1:1";
        imageSize = "2K";
        break;
      case "1080x1350":
        // Closest standard ratio for 1080x1350 is 3:4
        aspectRatio = "3:4";
        break;
      case "1958x745":
        // Closest standard ratio for wide landscape is 16:9
        aspectRatio = "16:9";
        break;
    }

    const parts: any[] = [];

    // Add original subject image
    if (originalImage) {
      const mimeType = originalImage.match(/data:([^;]+);/)?.[1] || 'image/png';
      const data = originalImage.split(',')[1];
      parts.push({
        inlineData: { data, mimeType },
      });
      parts.push({ text: "Use this as the original subject image (ori A)." });
    }

    // Add reference images
    referenceImages.forEach((img, index) => {
      if (img) {
        const mimeType = img.match(/data:([^;]+);/)?.[1] || 'image/png';
        const data = img.split(',')[1];
        parts.push({
          inlineData: { data, mimeType },
        });
        parts.push({ text: `Use this as reference image for style/composition/color ${String.fromCharCode(97 + index)}.` });
      }
    });

    // Add prompt
    parts.push({ text: `Task: Generate a new high-quality image based on this prompt: "${prompt}". Synthesize the subject from the original image and the artistic style/mood from the reference images.` });

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelName,
      contents: { parts },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
          ...(imageSize ? { imageSize } : {})
        }
      }
    });

    // Iterate through all parts to find the image part, as it might not be the first one
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }

    throw new Error('No image was generated.');
  } catch (error: any) {
    // If the request fails with an error message containing "Requested entity was not found.", 
    // reset the key selection state by throwing a specific error for the UI to handle.
    if (error?.message?.includes("Requested entity was not found")) {
        throw new Error("API_KEY_ERROR");
    }
    console.error('Gemini API Error:', error);
    throw error;
  }
};

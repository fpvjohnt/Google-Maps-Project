import { GoogleGenAI } from "@google/genai";
import { GeoLocation, MapSource } from "../types";

// Initialize the client with the API key from environment variables
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Queries the Gemini model with Google Maps Grounding.
 * 
 * @param prompt The user's text prompt.
 * @param location The user's current latitude and longitude.
 * @returns An object containing the generated text and a list of map sources.
 */
export const queryGeminiWithMaps = async (
  prompt: string, 
  location: GeoLocation
): Promise<{ text: string; sources: MapSource[] }> => {
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        // Enable Google Maps tool
        tools: [{ googleMaps: {} }],
        // Provide the user's location for grounding
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: location.latitude,
              longitude: location.longitude
            }
          }
        }
      },
    });

    const text = response.text || "No information available at this time.";
    
    // Extract grounding chunks to get Map URLs and titles
    const sources: MapSource[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;

    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web?.uri && chunk.web?.title) {
           sources.push({
             title: chunk.web.title,
             uri: chunk.web.uri
           });
        } else if (chunk.maps?.placeAnswerSources?.length > 0) {
            // Handle specific maps place answers if available
            // usually nested under maps -> placeAnswerSources or directly in chunks depending on API version
        }
      });
      
      // If the standard parsing above misses generic 'maps' typed chunks, let's inspect broadly
      chunks.forEach((chunk: any) => {
         // Sometimes it's strictly under 'web' for search results, but for Maps grounding specifically:
         // We often look for specific map URIs or titles embedded in the metadata.
         // The instructions say: extract URLs from groundingChunks... include groundingChunks.maps.uri
         if (chunk.maps?.uri) {
           // check if we already added it
           const exists = sources.find(s => s.uri === chunk.maps.uri);
           if (!exists) {
             sources.push({
               title: chunk.maps.title || "Google Maps Location",
               uri: chunk.maps.uri
             });
           }
         }
      });
    }

    return { text, sources };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
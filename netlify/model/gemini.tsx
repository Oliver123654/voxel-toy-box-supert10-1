import { GoogleGenAI, Type } from "@google/genai";

async function callGeminiStream(systemContext:string, prompt: string) {
            const ai = new GoogleGenAI(
                { 
                // apiKey: process.env.GEMINI_API_KEY 
            }
        );
            const model = 'gemini-3-pro-preview';
            console.log("Gemini model:", model);

            // const response = ai.models.generateContent({
            const response = ai.models.generateContentStream({

            model,
            contents: `
                    ${systemContext}
                    
                    Task: Generate a 3D voxel art model of: "${prompt}".
                    
                    Strict Rules:
                    1. Use approximately 150 to 200 voxels.
                    2. The model must be centered at x=0, z=0.
                    3. The bottom of the model must be at y=0 or slightly higher.
                    4. Ensure the structure is physically plausible (connected).
                    5. Coordinates should be integers.
                    
                    Return ONLY a JSON array of objects.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            x: { type: Type.INTEGER },
                            y: { type: Type.INTEGER },
                            z: { type: Type.INTEGER },
                            color: { type: Type.STRING, description: "Hex color code e.g. #FF5500" }
                        },
                        required: ["x", "y", "z", "color"]
                    }
                }
            }
        });
        console.log("Gemini response:", response);
        return response;
    }

export default callGeminiStream;
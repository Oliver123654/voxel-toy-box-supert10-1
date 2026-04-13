import strict from "assert/strict";

export const getLLMMessageContent = (systemContext: string, prompt: string) => `
                    ${systemContext}
                    
                    Task: Generate a 3D voxel art model of: "${prompt}".
                    
                    Strict Rules:
                    1. Use approximately 150 to 200 voxels. MUST NOT exceed 250 voxels at the maximum.
                    2. The model must be centered at x=0, z=0.
                    3. The bottom of the model must be at y=0 or slightly higher.
                    4. Ensure the structure is physically plausible (connected).
                    5. Coordinates should be integers.
                    
                    Return ONLY a JSON array of objects with x, y, z, and color properties.
                 `;

export const llmResponseSchema = {

  // type: "Type.ARRAY",
  type: "array",

  items: {
    // type: "Type.OBJECT",
    type: "object",

    properties: {
      x: { type: "integer" },
      y: { type: "integer" },
      z: { type: "integer" },
      color: { type: "string", description: "Hex color code e.g. #FF5500" }
    },
    required: ["x", "y", "z", "color"]
  },
  strict: true
}


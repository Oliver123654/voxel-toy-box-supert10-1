import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

const VoxelModel = z.object({
  x: z.int(),
  y: z.int(),
  z: z.int(),
  color: z.string()
});

const VoxelModelArray = z.object({
  voxel_model_array: z.array(VoxelModel)
});

const ENDPOINTS = {
  github: {
    base_url: "https://models.inference.ai.azure.com",
    api_key: import.meta.env.VITE_GITHUB_TOKEN ?? "",
  }
};

const mode = import.meta.env.VITE_SERVER_MODE || "github";

const openai = new OpenAI({
  baseURL: ENDPOINTS[mode]?.base_url || ENDPOINTS.github.base_url,
  apiKey: ENDPOINTS[mode]?.api_key || ENDPOINTS.github.api_key,
  dangerouslyAllowBrowser: true
});

function getLLMMessageContent(systemContext: string, prompt: string): string {
  return `You are a creative voxel art generator. Always respond with valid JSON.

${systemContext}

User request: ${prompt}

Your response must be a JSON object with a "voxel_model_array" property containing an array of voxels. Each voxel should have x, y, z (integers) and color (hex string like "#FF0000").

Example response format:
{
  "voxel_model_array": [
    {"x": 0, "y": 0, "z": 0, "color": "#FF0000"},
    {"x": 1, "y": 0, "z": 0, "color": "#00FF00"}
  ]
}`;
}

export async function callVoxelModel(systemContext: string, prompt: string): Promise<any[]> {
  const model = "gpt-4o-mini";
  const llm_message_content = getLLMMessageContent(systemContext, prompt);

  const requestBody = {
    model,
    messages: [
      {
        role: "user",
        content: llm_message_content
      }
    ],
    response_format: zodResponseFormat(VoxelModelArray, "voxel_model_array"),
  };

  try {
    const completion = await openai.chat.completions.create(requestBody);
    const responseText = completion.choices[0]?.message?.content;

    if (!responseText) {
      throw new Error("No response from LLM");
    }

    const parsed = JSON.parse(responseText);
    return parsed.voxel_model_array || parsed;
  } catch (error) {
    console.error("LLM call failed:", error);
    throw error;
  }
}

export default callVoxelModel;
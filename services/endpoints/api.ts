
import type { Context } from "@netlify/functions";

async function api<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
const NETLIFY_URL = "/.netlify/functions/";
const API_BASE_URL = process.env.API_BASE_URL || NETLIFY_URL || "/api/";

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}


export default api;
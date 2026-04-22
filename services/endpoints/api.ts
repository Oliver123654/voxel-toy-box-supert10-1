
async function api<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    '/api/';

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
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

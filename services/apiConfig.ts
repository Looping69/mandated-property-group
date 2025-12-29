
const API_URL = import.meta.env.VITE_ENCORE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:4000');

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
        throw new Error(error.message || `API Request failed: ${response.statusText}`);
    }

    // Handle empty responses (e.g., DELETE operations)
    const text = await response.text();
    return text ? JSON.parse(text) : ({} as T);
}

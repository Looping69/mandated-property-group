
const API_URL = import.meta.env.VITE_ENCORE_API_URL ||
    (import.meta.env.DEV ? 'http://localhost:4000' : '');

if (!API_URL && import.meta.env.PROD) {
    console.warn('VITE_ENCORE_API_URL is not defined. Falling back to current origin.');
}

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
    const headers = new Headers(options.headers);

    // Ensure Content-Type is set if not already
    if (!headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        let errorMsg = `API Request failed: ${response.statusText}`;
        try {
            const error = await response.json();
            errorMsg = error.message || errorMsg;
        } catch {
            // No JSON body
        }
        throw new Error(errorMsg);
    }

    // Handle empty responses (e.g., DELETE operations)
    const text = await response.text();
    return text ? JSON.parse(text) : ({} as T);
}

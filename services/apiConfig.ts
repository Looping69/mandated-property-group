/**
 * API Configuration
 * 
 * Centralized API request handling with auth token management.
 */

const getBaseUrl = (): string => {
    // Priority 1: Environment variable
    const envUrl = process.env.ENCORE_API_URL;
    if (envUrl && envUrl.trim() !== "") return envUrl;

    // Priority 2: Localhost development
    if (typeof window !== "undefined") {
        const { hostname } = window.location;
        if (hostname === "localhost" || hostname === "127.0.0.1") {
            return "http://localhost:4000";
        }
    }

    // Default: relative path for production
    return "";
};

const API_URL = getBaseUrl();

/**
 * Get the stored auth token
 */
export function getAuthToken(): string | null {
    if (typeof window !== "undefined") {
        return localStorage.getItem('auth_token');
    }
    return null;
}

/**
 * Make an API request with automatic auth header injection
 */
export async function apiRequest<T>(
    path: string,
    options: RequestInit = {}
): Promise<T> {
    const headers = new Headers(options.headers);

    // Set Content-Type if not already set
    if (!headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }

    // Add Authorization header if we have a token
    const token = getAuthToken();
    if (token && !headers.has('Authorization')) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    const url = `${API_URL}${path}`;

    const response = await fetch(url, {
        ...options,
        headers,
    });

    // Handle errors
    if (!response.ok) {
        let errorMsg = `Request failed: ${response.status} ${response.statusText}`;
        try {
            const error = await response.json();
            errorMsg = error.message || error.error || errorMsg;
        } catch {
            // No JSON body
        }
        throw new Error(errorMsg);
    }

    // Handle empty responses
    const text = await response.text();
    if (!text) {
        return {} as T;
    }

    try {
        return JSON.parse(text);
    } catch {
        return text as unknown as T;
    }
}

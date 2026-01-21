/**
 * API Configuration
 * 
 * Centralized API request handling with auth token management.
 */

const getBaseUrl = (): string => {
    // Priority 1: Environment variable (defined in vite.config.ts or .env)
    // Try both Vite-style and process-style
    const envUrl = (import.meta.env?.VITE_ENCORE_API_URL as string) ||
        (process.env.ENCORE_API_URL as string);

    if (envUrl && envUrl.trim() !== "") {
        // Ensure the URL doesn't end with a slash as we prepend it in apiRequest
        return envUrl.replace(/\/$/, "");
    }

    // Priority 2: Localhost development fallback
    if (typeof window !== "undefined") {
        const { hostname } = window.location;
        if (hostname === "localhost" || hostname === "127.0.0.1") {
            return "http://localhost:4000";
        }
    }

    // Warning for production build with no API URL and no rewrite capability
    if (typeof process !== 'undefined' && process.env.NODE_ENV === 'production') {
        console.info('API calls will be made relative to the current domain (relying on rewrites)');
    }

    // Default: relative path for production (works if frontend & backend are on same domain/rewrites)
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
        let errorMsg = `API Error: ${response.status} ${response.statusText}`;
        let details = '';
        try {
            const error = await response.json();
            errorMsg = error.message || error.error || errorMsg;
            details = JSON.stringify(error);
        } catch {
            // No JSON body
        }

        console.error(`[API Request Failed] ${options.method || 'GET'} ${url}`, {
            status: response.status,
            message: errorMsg,
            details
        });

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

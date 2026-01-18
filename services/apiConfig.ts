const getBaseUrl = () => {
    // Priority 1: Use the injected environment variable (via Vite define)
    const envUrl = process.env.ENCORE_API_URL;
    if (envUrl && envUrl.trim() !== "") return envUrl;

    // Priority 2: Safe defaults for localhost (fixes local build tests)
    if (typeof window !== "undefined") {
        const { hostname } = window.location;
        if (hostname === "localhost" || hostname === "127.0.0.1") {
            return "http://localhost:4000";
        }
    }

    // Default: relative path for production where Encore might be on the same domain
    return "";
};

export const getAuthToken = () => {
    if (typeof window !== "undefined") {
        return localStorage.getItem('encore_session_token');
    }
    return null;
};

const API_URL = getBaseUrl();

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
    const headers = new Headers(options.headers);

    // Ensure Content-Type is set if not already
    if (!headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }

    // Add Authorization header if token exists
    const token = getAuthToken();
    if (token && !headers.has('Authorization')) {
        headers.set('Authorization', `Bearer ${token}`);
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

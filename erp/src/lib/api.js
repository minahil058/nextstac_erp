import { supabase } from './supabase';

const API_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Get current Supabase session token from manual localStorage
 * NOTE: We use manual session management because Supabase's built-in persistence was causing hangs
 */
const getAuthToken = async () => {
    try {
        // Read from manual localStorage session
        const sessionData = localStorage.getItem('app_session');
        if (!sessionData) {
            console.warn('No session found in localStorage');
            return '';
        }

        const session = JSON.parse(sessionData);

        // Check if session is expired
        if (session.expiresAt && session.expiresAt < Date.now()) {
            console.warn('Session expired');
            localStorage.removeItem('app_session');
            return '';
        }

        return session.access_token || '';
    } catch (error) {
        console.error('Error getting auth token:', error);
        return '';
    }
};

/**
 * Make authenticated API request
 */
export const apiRequest = async (endpoint, options = {}) => {
    const token = await getAuthToken();

    const defaultHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers
        }
    };

    const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`;

    const response = await fetch(url, config);

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(error.error || error.message || `HTTP ${response.status}`);
    }

    // For DELETE requests, return simple success
    if (options.method === 'DELETE') {
        return { success: true };
    }

    return response.json();
};

/**
 * Convenience methods for common HTTP verbs
 */
export const api = {
    get: (endpoint) => apiRequest(endpoint, { method: 'GET' }),

    post: (endpoint, data) => apiRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(data)
    }),

    put: (endpoint, data) => apiRequest(endpoint, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),

    patch: (endpoint, data) => apiRequest(endpoint, {
        method: 'PATCH',
        body: JSON.stringify(data)
    }),

    delete: (endpoint) => apiRequest(endpoint, { method: 'DELETE' })
};

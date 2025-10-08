import apiClient from './apiClient'

/**
 * Low-level API communication layer
 * Handles HTTP requests/responses matching the OpenAPI spec
 */
export const authApi = {
    /**
     * Fetch CSRF token
     * GET /csrf
     */
    getCsrfToken: async () => {
        const response = await apiClient.get('/csrf');
        return response.data;
    },

    /**
     * Login user
     * POST /auth/login
     * @param {Object} loginRequest - { email, password, staySignedIn }
     * @returns {Promise} CustomResponseObject
     */
    login: async (loginRequest) => {
        const response = await apiClient.post('/auth/login', loginRequest);
        return response.data;
    },

    /**
     * Register user
     * POST /auth/register
     * @param {Object} registerRequest - { email, password }
     * @returns {Promise} CustomResponseString
     */
    register: async (registerRequest) => {
        const response = await apiClient.post('/auth/register', registerRequest);
        return response.data;
    },

    /**
     * Logout user
     * POST /auth/logout (assuming endpoint exists)
     */
    logout: async () => {
        const response = await apiClient.post('/auth/logout');
        return response.data;
    },

    /**
     * Get current user details
     * GET /api/user
     * @returns {Promise} CustomResponseUserResponse
     */
    getCurrentUser: async () => {
        const response = await apiClient.get('/api/user');
        return response.data;
    },
};
import apiClient from "./clientApi";
import "./types";

export const userApi = {
    /**
     * Get current user information
     * @returns {Promise<import("./types").UserResponse>}
     */
    getUser: async () => {
        const apiResponse = await apiClient.get("/api/user/");
        return apiResponse.data;
    },
    /**
     * Update current user information
     * @param {object} payload
     */
    updateUser: async (payload) => {
        const apiResponse = await apiClient.put('/api/user/', payload);
        return apiResponse.data;
    },

    /**
     * Upload avatar file for current user
     * @param {FormData} formData
     */
    uploadAvatar: async (formData) => {
        // Do NOT manually set Content-Type for FormData — the browser will
        // add the required multipart boundary. Setting it manually can
        // cause the server to reject the request.
        // Add a lightweight debug log so we can see the exact target URL
        // when the upload is attempted in the browser devtools.
        try {
            const base = apiClient.defaults.baseURL || window.location.origin;
            console.debug('[userApi] uploading avatar to', `${base}/api/user/avatar`);
        } catch (e) {
            // ignore logging issues
        }

        const apiResponse = await apiClient.post('/api/user/avatar', formData);
        return apiResponse.data;
    },
    /**
     * Change password for current user
     * @param {{currentPassword: string, newPassword: string}} payload
     */
    changePassword: async (payload) => {
        const apiResponse = await apiClient.post('/api/user/change-password', payload);
        return apiResponse.data;
    },
};
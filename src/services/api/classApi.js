import apiClient from "./clientApi";
import "./types";

export const classApi = {
    /**
     * Get paginated list of classes
     * @param {number} page - Page number
     * @param {number} limit - Items per page
     * @param {boolean} isTreasurer - Filter by treasurer
     * @returns {Promise<import("./types").ClassesListResponse>}
     */
    getClasses: async (page = 1, limit = 10, isTreasurer = false) => {
        const response = await apiClient.get("/api/class/list",
            {
                params: { page, limit, isTreasurer }
            }
        );
        return response.data;
    },

    /**
     * Create a new class
     * @param {string} name - Class name
     * @returns {Promise<import("./types").ClassResponse>}
     */
    createClass: async (name) => {
        const response = await apiClient.post("/api/class/create", null, {
            params: { name }
        });
        return response.data;
    },

    /**
     * Edit an existing class
     * @param {number} classId - Class ID
     * @param {Object} updates - Updates to apply
     * @param {string} updates.name - New class name
     * @returns {Promise<import("./types").ClassResponse>}
     */
    editClass: async (classId, updates) => {
        const response = await apiClient.put(`/api/class/${classId}`, updates);
        return response.data;
    },

    /**
     * Delete a class
     * @param {number} classId - Class ID
     * @returns {Promise<import("./types").EmptyResponse>}
     */
    deleteClass: async (classId) => {
        const response = await apiClient.delete(`/api/class/${classId}`);
        return response.data;
    },

    /**
     * Get access code for a class
     * @param {number} classId - Class ID
     * @returns {Promise<import("./types").ClassAccessTokenResponse>}
     */
    getAccessCode: async (classId) => {
        const response = await apiClient.get(`/api/class-access-token/${classId}`);
        return response.data;
    },

    /**
     * Join a class with an access code
     * @param {string} classId - Class ID (UUID)
     * @param {string} studentId - Student ID (UUID)
     * @param {string} accessCode - 4-digit access code
     * @returns {Promise<import("./types").ClassResponse>}
     */
    joinClass: async (classId, studentId, accessCode) => {
        const response = await apiClient.post("/api/class-member/add", null, {
            params: { classId, studentId, accessCode }
        });
        return response.data;
    }
}
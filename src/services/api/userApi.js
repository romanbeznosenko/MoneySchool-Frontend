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
};
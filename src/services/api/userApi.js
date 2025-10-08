import apiClient from "./apiClient";

export const userApi = {
    getUser: async () => {
        const apiResponse = await apiClient.get("/api/user/");
        return apiResponse.data;
    },
};
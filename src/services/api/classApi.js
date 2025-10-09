import { param } from "framer-motion/client";
import apiClient from "./apiClient";

export const classApi = {
    getClasses: async (page = 1, limit = 10, isTreasurer = false) => {
        const response = await apiClient.get("/api/class/list",
            {
                params: { page, limit, isTreasurer }
            }
        );
        return response.data;
    },

    createClass: async (name) => {
        const response = await apiClient.post("/api/class/create", null, {
            params: { name }
        });
        return response.data;
    },

    editClass: async (classId, updates) => {
        const response = await apiClient.put(`/api/class/${classId}`, updates);
        return response.data;
    },

    deleteClass: async (classId) => {
        const response = await apiClient.delete(`/api/class/${classId}`);
        return response.data;
    }
}
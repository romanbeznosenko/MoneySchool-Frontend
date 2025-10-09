import apiClient from './apiClient';

export const studentApi = {
    createStudent: async (studentData) => {
        const response = await apiClient.post("/api/student/create", studentData);
        return response.data;
    },

    getUserStudents: async (page = 1, limit = 10) => {
        const response = await apiClient.get("/api/student/list", 
            {
                params: {page, limit}
            }
        );
        return response.data;
    }
}
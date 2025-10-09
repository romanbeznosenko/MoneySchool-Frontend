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
    },

    updateStudent: async (studentId, updates) => {
        const response = await apiClient.put(`/api/student/${studentId}`, updates);
        return response.data;
    },

    deleteStudent: async (studentId) => {
        console.log('Delete student called for ID:', studentId);
        throw new Error('Delete functionality not yet implemented on backend');
    },
}
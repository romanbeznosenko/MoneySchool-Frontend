import apiClient from './clientApi'

export const authApi = {
    getCsrfToken: async () => {
        const response = await apiClient.get('/csrf');
        return response.data;
    },

    login: async (loginRequest) => {
        const response = await apiClient.post('/auth/login', loginRequest);
        return response.data;
    },

    register: async (registerRequest) => {
        const response = await apiClient.post('/auth/register', registerRequest);
        return response.data;
    },

    logout: async () => {
        const response = await apiClient.post('/auth/logout');
        return response.data;
    },

    getCurrentUser: async () => {
        const response = await apiClient.get('/api/user');
        return response.data;
    },
};
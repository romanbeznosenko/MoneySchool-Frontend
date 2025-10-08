import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const errorMessage = 
            error.response?.data?.message || 
            error.response?.data?.error ||
            error.message || 
            'An error occurred';
        
        const httpStatus = error.response?.data?.httpStatus || error.response?.status;
        
        const structuredError = new Error(errorMessage);
        structuredError.httpStatus = httpStatus;
        structuredError.originalError = error;
        
        return Promise.reject(structuredError);
    }
);

export default apiClient;
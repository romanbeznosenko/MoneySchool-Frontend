import axios from 'axios';
import "./types";

const API_BASE_URL = 'http://localhost:8080';

/**
 * Configured axios instance for API requests
 * All responses follow the CustomResponse<T> format from the backend
 * @type {import('axios').AxiosInstance}
 */
export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Request interceptor
 * Can be used to add auth tokens, modify headers, etc.
 */
apiClient.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Response interceptor
 * Extracts error information from CustomResponse format
 * Creates structured errors with message and httpStatus
 */
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Extract error message from CustomResponse format
        const errorMessage =
            error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            'An error occurred';

        // Extract HTTP status from CustomResponse or response
        const httpStatus = error.response?.data?.httpStatus || error.response?.status;

        // Create structured error object
        const structuredError = new Error(errorMessage);
        structuredError.httpStatus = httpStatus;
        structuredError.originalError = error;

        return Promise.reject(structuredError);
    }
);

export default apiClient;

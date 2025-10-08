import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    withCredentials: true,
});

export const getCsrfToken = async () => {
    try {
        await apiClient.get('/csrf');
        console.log('CSRF token fetched and cookie set');
    } catch (err) {
        console.error('getCsrfToken error:', err);
        throw new Error('Failed to get CSRF token: ' + err.message);
    }
};

export const login = async (email, password) => {
    try {
        const data = await apiClient.post('/auth/login', { email, password });
        console.log('Login successful');
        return data;
    } catch (err) {
        console.error('loginApi error:', err);
        throw err;
    }
};

export const register = async (email, password, confirmPassword) => {
    try {
        const data = await apiClient.post('/auth/register', {
            email,
            password,
            confirmPassword,
        });
        console.log('Registration successful');
        return data;
    } catch (err) {
        console.error('registerApi error:', err);
        throw err;
    }
};

export const logout = async () => {
    try {
        const data = await apiClient.post('/logout');
        console.log('Logout successful');
        return data;
    } catch (err) {
        console.error('logoutApi error:', err);
        throw err;
    }
};

export default apiClient;
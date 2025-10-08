import { useState } from 'react';
import { loginApi } from '../services/api/authApi';

export const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleLogin = async (email, password, onSuccess) => {
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const data = await loginApi(email, password);
            setSuccess('Login successful!');

            if (onSuccess) onSuccess(data);

            return data;
        } catch (err) {
            setError(err.message || 'Login failed');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const clearMessages = () => {
        setError('');
        setSuccess('');
    };

    return {
        handleLogin,
        loading,
        error,
        success,
        clearMessages,
    };
};

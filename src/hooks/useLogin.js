import { useState } from 'react';
import { authService } from '../services/authService';

export const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleLogin = async (email, password, staySignedIn) => {
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const responseDto = await authService.login(email, password, staySignedIn);

            setSuccess('Login successful!');

            return responseDto;
        } catch (errorDto) {
            setError(errorDto.message);
            throw errorDto;
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
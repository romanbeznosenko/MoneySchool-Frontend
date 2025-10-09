import { useState } from 'react';
import { authService } from '../services/authService';

export function useRegister() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleRegister = async (email, password, confirmPassword) => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(null);

            const responseDto = await authService.register(email, password, confirmPassword);

            setSuccess('Account created successfully! Redirecting to login...');
            return responseDto;
        } catch (err) {
            console.error('Registration error:', err);

            if (err.httpStatus === 409) {
                setError('An account with this email already exists. Please use a different email or try logging in.');
            } else {
                setError(err.message || 'Registration failed. Please try again.');
            }

            throw err;
        } finally {
            setLoading(false);
        }
    };

    const clearMessages = () => {
        setError(null);
        setSuccess(null);
    };

    return {
        handleRegister,
        loading,
        error,
        success,
        clearMessages,
    };
}
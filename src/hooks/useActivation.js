import { useState } from 'react';
import { authService } from '../services/authService';

export function useActivation() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [resendLoading, setResendLoading] = useState(false);
    const [resendError, setResendError] = useState(null);
    const [resendSuccess, setResendSuccess] = useState(null);

    const handleActivation = async (email, code) => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(null);

            await authService.activateAccount(email, code);

            setSuccess('Account activated successfully! Redirecting to login...');
        } catch (err) {
            console.error('Activation error:', err);

            if (err.httpStatus === 404) {
                setError('Invalid activation code. Please check and try again.');
            } else if (err.httpStatus === 409) {
                setError('Account is already activated. Please login.');
            } else if (err.httpStatus === 410) {
                setError('Activation code has expired. Please request a new code.');
            } else {
                setError(err.message || 'Activation failed. Please try again.');
            }

            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleResendCode = async (email) => {
        try {
            setResendLoading(true);
            setResendError(null);
            setResendSuccess(null);

            await authService.resendActivationCode(email);

            setResendSuccess('Activation code has been resent to your email.');
        } catch (err) {
            console.error('Resend code error:', err);

            if (err.httpStatus === 404) {
                setResendError('User not found. Please register first.');
            } else if (err.httpStatus === 409) {
                setResendError('Account is already activated. Please login.');
            } else if (err.message && err.message.includes('less than 3 minutes ago')) {
                setResendError(err.message);
            } else {
                setResendError(err.message || 'Failed to resend code. Please try again.');
            }

            throw err;
        } finally {
            setResendLoading(false);
        }
    };

    const clearMessages = () => {
        setError(null);
        setSuccess(null);
        setResendError(null);
        setResendSuccess(null);
    };

    return {
        handleActivation,
        handleResendCode,
        loading,
        error,
        success,
        resendLoading,
        resendError,
        resendSuccess,
        clearMessages,
    };
}

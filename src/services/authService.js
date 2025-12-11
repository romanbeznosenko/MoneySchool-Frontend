import { authApi } from '../services/api/authApi';
import { LoginRequestDto } from '../dto/auth/LoginRequest';
import { RegisterRequestDto } from '../dto/auth/RegisterRequest';
import { AccountActivationRequestDto } from '../dto/auth/AccountActivationRequest';
import { VerificationCodeResendRequestDto } from '../dto/auth/VerificationCodeResendRequest';
import { ErrorResponseDto } from '../dto/ErrorResponse';
import { AuthResponseDto } from '../dto/auth/AuthResponse';

export const authService = {
    initializeCsrf: async () => {
        try {
            await authApi.getCsrfToken();
            console.log('CSRF token initialized');
            return true;
        } catch (error) {
            console.error('Failed to initialize CSRF:', error);
            throw new ErrorResponseDto(
                'Failed to initialize security token',
                error.httpStatus
            );
        }
    },

    login: async (email, password, staySignedIn = false) => {
        try {
            if (!email || !email.trim()) {
                throw new Error('Email is required');
            }
            if (!password || !password.trim()) {
                throw new Error('Password is required');
            }

            // Get CSRF token before login (required for session authentication)
            // console.log('Fetching CSRF token...');
            // const csrfResponse = await authApi.getCsrfToken();r
            // console.log('CSRF token received:', csrfResponse);
            // console.log('Cookies after CSRF:', document.cookie);

            const requestDto = new LoginRequestDto(email, password, staySignedIn);

            console.log('Attempting login with credentials...');
            const apiResponse = await authApi.login(requestDto);

            const responseDto = new AuthResponseDto(apiResponse);

            console.log('Login successful:', responseDto.message);
            return responseDto;
        } catch (error) {
            console.error('Login service error:', error);
            throw new ErrorResponseDto(
                error.message || 'Login failed. Please check your credentials.',
                error.httpStatus
            );
        }
    },

    register: async (email, password, confirmPassword) => {
        try {
            if (!email || !email.trim()) {
                throw new Error('Email is required');
            }
            if (!password || !password.trim()) {
                throw new Error('Password is required');
            }
            if (password !== confirmPassword) {
                throw new Error('Passwords do not match');
            }
            if (password.length < 8) {
                throw new Error('Password must be at least 8 characters long');
            }

            const requestDto = new RegisterRequestDto(email, password);

            const apiResponse = await authApi.register(requestDto);

            const responseDto = new AuthResponseDto(apiResponse);

            console.log('Registration successful:', responseDto.message);
            return responseDto;
        } catch (error) {
            console.error('Registration service error:', error);
            throw new ErrorResponseDto(
                error.message || 'Registration failed. Please try again.',
                error.httpStatus
            );
        }
    },

    logout: async () => {
        try {
            await authApi.logout();
            console.log('User logged out successfully');
        } catch (error) {
            console.error('Logout service error:', error);
            throw new ErrorResponseDto(
                error.message || 'Logout failed. Please try again.',
                error.httpStatus
            );
        }
    },

    getCurrentUser: async () => {
        try {
            const apiResponse = await authApi.getCurrentUser();

            const userDto = new UserResponseDto(apiResponse.data);

            console.log('User data retrieved successfully');
            return userDto;
        } catch (error) {
            console.error('Get user service error:', error);
            throw new ErrorResponseDto(
                error.message || 'Failed to retrieve user data.',
                error.httpStatus
            );
        }
    },

    activateAccount: async (email, code) => {
        try {
            if (!email || !email.trim()) {
                throw new Error('Email is required');
            }
            if (!code || !code.trim()) {
                throw new Error('Activation code is required');
            }
            if (code.length !== 4) {
                throw new Error('Activation code must be 4 digits');
            }

            const requestDto = new AccountActivationRequestDto(email, code);

            const apiResponse = await authApi.activateAccount(requestDto);

            console.log('Account activated successfully');
            return apiResponse;
        } catch (error) {
            console.error('Account activation service error:', error);
            throw new ErrorResponseDto(
                error.message || 'Account activation failed. Please try again.',
                error.httpStatus
            );
        }
    },

    resendActivationCode: async (email) => {
        try {
            if (!email || !email.trim()) {
                throw new Error('Email is required');
            }

            const requestDto = new VerificationCodeResendRequestDto(email);

            const apiResponse = await authApi.resendActivationCode(requestDto);

            console.log('Activation code resent successfully');
            return apiResponse;
        } catch (error) {
            console.error('Resend activation code service error:', error);
            throw new ErrorResponseDto(
                error.message || 'Failed to resend activation code. Please try again.',
                error.httpStatus
            );
        }
    },
};
import { authApi } from '../services/api/authApi';
import { LoginRequestDto } from '../dto/auth/LoginRequest';
import { RegisterRequestDto } from '../dto/auth/RegisterRequest';
import { ErrorResponseDto } from '../dto/ErrorResponse';
import { AuthResponseDto } from '../dto/auth/AuthResponse';
import { CustomResponseDto } from '../dto/CustomResponse';
/**
 * Service layer that handles business logic and DTO transformations
 * Components interact with this layer, not directly with the API
 */
export const authService = {
    /**
     * Initialize CSRF protection
     * Should be called once when app starts
     */
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

    // In authService.js
    login: async (email, password, staySignedIn = false) => {
        try {
            // Validate inputs
            if (!email || !email.trim()) {
                throw new Error('Email is required');
            }
            if (!password || !password.trim()) {
                throw new Error('Password is required');
            }

            // Create request DTO with staySignedIn
            const requestDto = new LoginRequestDto(email, password, staySignedIn);

            // Call API - returns CustomResponseObject
            const apiResponse = await authApi.login(requestDto);

            // Transform to response DTO
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

    /**
     * Register new user
     * @param {string} email
     * @param {string} password
     * @param {string} confirmPassword
     * @returns {Promise<AuthResponseDto>}
     */
    register: async (email, password, confirmPassword) => {
        try {
            // Validate inputs
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

            // Create request DTO (backend doesn't need confirmPassword)
            const requestDto = new RegisterRequestDto(email, password);

            // Call API - returns CustomResponseString
            const apiResponse = await authApi.register(requestDto);

            // Transform to response DTO
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

    /**
     * Logout user
     * @returns {Promise<void>}
     */
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

    /**
     * Get current user information
     * @returns {Promise<UserResponseDto>}
     */
    getCurrentUser: async () => {
        try {
            // Call API - returns CustomResponseUserResponse
            const apiResponse = await authApi.getCurrentUser();

            // Transform to UserResponseDto
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
};
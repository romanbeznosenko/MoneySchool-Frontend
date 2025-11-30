import { userApi } from './api/userApi';
import {UserResponseDto} from '../dto/user/UserResponse';
import { ErrorResponseDto } from '../dto/ErrorResponse';

export const userService = {
    getUser: async () => {
        try{
            const apiResponse = await userApi.getUser();
            console.log('Getting information about logged user');

            const userDto = new UserResponseDto(apiResponse.data);
            console.log('User data retreived successfully.');
            return userDto;
        } catch (error) {
            console.error('Get user service error: ', error);
            throw new ErrorResponseDto(
                error.message,
                error.httpStatus
            );
        }
    },
    updateUser: async (payload) => {
        try {
            const apiResponse = await userApi.updateUser(payload);
            const userDto = new UserResponseDto(apiResponse.data);
            return userDto;
        } catch (error) {
            console.error('Update user service error: ', error);
            // rethrow original structured error when available so caller can inspect response
            throw error?.originalError || error;
        }
    },
    uploadAvatar: async (file) => {
        try {
            const formData = new FormData();
            // backend commonly expects 'avatar' as the file field name
            formData.append('avatar', file);
            const apiResponse = await userApi.uploadAvatar(formData);
            return apiResponse.data;
        } catch (error) {
            console.error('Upload avatar service error:', error);
            throw error?.originalError || error;
        }
    }
    ,
    changePassword: async (currentPassword, newPassword) => {
        try {
            const payload = { currentPassword, newPassword };
            const apiResponse = await userApi.changePassword(payload);
            return apiResponse;
        } catch (error) {
            console.error('Change password error:', error);
            throw error?.originalError || error;
        }
    }
};
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
};
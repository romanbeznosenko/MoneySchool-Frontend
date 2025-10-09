import { UserResponseDto } from '../user/UserResponse';

export class ClassGetResponseDto {
    constructor(data) {
        this.id = data?.id || null;
        this.name = data?.name || '';
        this.treasurer = data?.treasurer ? new UserResponseDto(data.treasurer) : null;
    }
}
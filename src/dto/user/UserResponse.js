export class UserResponseDto {
    constructor(data) {
        this.id = data?.id || null;
        this.email = data?.email || '';
        this.name = data?.name || '';
        this.surname = data?.surname || '';
        this.avatar = data?.avatar || '';
    }
}
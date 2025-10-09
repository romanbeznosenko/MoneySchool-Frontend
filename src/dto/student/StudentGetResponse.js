import { ClassGetResponseDto } from '../class/ClassGetResponse';
import { UserResponseDto } from '../user/UserResponse';

export class StudentGetResponseDto {
    constructor(data) {
        this.id = data?.id || null;
        this.firstName = data?.firstName || '';
        this.lastName = data?.lastName || '';
        this.birthDate = data?.birthDate || null;
        this.avatar = data?.avatar || '';

        this.parent = data?.parent ? new UserResponseDto(data.parent) : null;

        this.classes = (data?.classes || []).map(
            classData => new ClassGetResponseDto(classData)
        );
    }

    get fullName() {
        return `${this.firstName} ${this.lastName}`.trim();
    }

    get age() {
        if (!this.birthDate) return null;

        const birthDate = new Date(this.birthDate);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    }
}
export class CustomResponseDto {
    constructor(response) {
        this.data = response?.data || null;
        this.message = response?.message || '';
        this.httpStatus = response?.httpStatus || '';
    }
}
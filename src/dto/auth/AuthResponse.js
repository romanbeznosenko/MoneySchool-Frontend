import { CustomResponseDto } from "../CustomResponse";

export class AuthResponseDto extends CustomResponseDto {
    constructor(response) {
        super(response);
        this.user = this.data || null;
    }
}
import { CustomResponseDto } from "../CustomResponse";
import { ClassGetResponseDto } from "./ClassGetResponse";

export class ClassGetPageResponseDto extends CustomResponseDto {
    constructor(response) {
        super(response);
        this.count = this.data?.count || 0;
        this.classes = (this.data?.data || []).map(
            clas => new ClassGetResponseDto(clas)
        );
    }
}
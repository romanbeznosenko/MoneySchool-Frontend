import { CustomResponseDto } from './../CustomResponse';
import { StudentGetResponseDto } from './StudentGetRequest';


export class StudentGetPageResponseDto extends CustomResponseDto {
    constructor(response) {
        super(response);
        this.count = this.data?.count || 0;
        this.students = (this.data?.data || []).map(
            student => new StudentGetResponseDto(student)
        );
    }
}
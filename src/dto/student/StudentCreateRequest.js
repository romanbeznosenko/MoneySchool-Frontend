export class StudentCreateRequestDto {
    constructor(firstName, lastName, birthDate) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.birthDate = birthDate; // format: "2004-08-19"
    }
}
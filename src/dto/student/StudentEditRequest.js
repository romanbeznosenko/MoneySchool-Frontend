export class StudentEditRequestDto {
    constructor(firstName, lastName, birthDate) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.birthDate = birthDate; // Should be in format YYYY-MM-DD
    }
}
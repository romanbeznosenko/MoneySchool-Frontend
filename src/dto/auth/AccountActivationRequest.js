export class AccountActivationRequestDto {
    constructor(email, code) {
        this.email = email;
        this.code = code;
    }

    toJSON() {
        return {
            email: this.email,
            code: this.code
        };
    }
}

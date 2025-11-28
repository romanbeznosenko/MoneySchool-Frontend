export class VerificationCodeResendRequestDto {
    constructor(email) {
        this.email = email;
    }

    toJSON() {
        return {
            email: this.email
        };
    }
}

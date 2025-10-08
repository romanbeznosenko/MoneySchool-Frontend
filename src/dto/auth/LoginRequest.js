export class LoginRequestDto {
    constructor(email, password, staySignedIn = false) {
        this.email = email;
        this.password = password;
        this.staySignedIn = staySignedIn;
    }
}
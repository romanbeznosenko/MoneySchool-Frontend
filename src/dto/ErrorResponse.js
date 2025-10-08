export class ErrorResponseDto extends Error {
    constructor(message, httpStatus = null, code = null) {
        super(message);
        this.name = 'ErrorResponseDto';
        this.message = message;
        this.httpStatus = httpStatus;
        this.code = code;
        this.timestamp = new Date().toISOString();
    }
}
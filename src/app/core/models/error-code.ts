export class ErrorCode {
    ERR_NUM: string;
    MESSAGE: string;

    constructor(errNum: string, message: string) {
        this.ERR_NUM = errNum;
        this.MESSAGE = message;
    }
}
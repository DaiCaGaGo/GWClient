export class ServiceReturn {
    ErrCode: string;
    ErrMessage: string;

    constructor(errCode: string, errMessage: string) {
        this.ErrCode = errCode;
        this.ErrMessage = errMessage;
    }
}
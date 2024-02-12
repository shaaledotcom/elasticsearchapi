import { ErrorInterface } from '../ErrorInterface';

export interface IError {
    status: number;
    error: ErrorInterface,
}


class ApiError extends Error implements IError {
    public status = 500;
    // public success = false;

    public error: {
        message: string,
        code: string,
    };

    constructor(statusCode: number, error: ErrorInterface) {
        super();
        this.error = error;
        this.status = statusCode;

    }
}

export default ApiError;

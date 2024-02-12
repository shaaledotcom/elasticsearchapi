import * as express from 'express';
import {StatusCodes,} from 'http-status-codes';
import ApiError from '../abstractions/ApiError';
import {invalidInternalServer} from "../constants";

const addErrorHandler = (
    err: ApiError, req: express.Request,
    res: express.Response,
    next: express.NextFunction,
): void => {

    if (err) {
        const status: number = err?.status ?? StatusCodes.INTERNAL_SERVER_ERROR;
        // logger.info(`REQUEST HANDLING ERROR:
        // \nERROR:\n${JSON.stringify(err)}
        // \nREQUEST HEADERS:\n${util.inspect(req.headers)}
        // \nREQUEST PARAMS:\n${util.inspect(req.params)}
        // \nREQUEST QUERY:\n${util.inspect(req.query)}
        // \nBODY:\n${util.inspect(req.body)}`);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        console.log('error stack',err.stack)
        const body: any = {
            // fields: err.fields,
            error:err.error ?? invalidInternalServer,
            status,
            stack: '',
        };

        // If the environment is production then no need to send error stack trace
        if (process.env.LOCAL === 'yes') {
            body.stack = err.stack;
        } else {
            delete body.stack;
            delete body.status;
        }
        // if(environment.applyEncryption) {
        //   body = encrypt(JSON.stringify(body), environment.secretKey);
        // }
        res.status(status).json(body);
    }
    next();
};

export default addErrorHandler;

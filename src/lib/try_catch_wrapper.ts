import {NextFunction, Request, Response} from 'express';

/**
 * wraps the incoming function in try catch block
 * @param incomingFunction
 * @returns {(req: e.Request, res: e.Response, next: e.NextFunction) => Promise<any>}
 */
function tryCatchWrapper(incomingFunction) {
    return async function wrappedFn(req: Request, res: Response, next: NextFunction) {
//         ^^^^^
        try {
            return await incomingFunction.apply(this, arguments);
//                 ^^^^^
        } catch (error) {
            console.log('catching error',error);
            if (next) {
                next(error);
            }

        }
    };
}

export default tryCatchWrapper;
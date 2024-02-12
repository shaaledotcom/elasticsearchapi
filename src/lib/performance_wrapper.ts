import {NextFunction, Request, Response} from 'express';
import {performance} from "perf_hooks";

/**
 * wraps the incoming function in try catch block
 * @param incomingFunction
 * @returns {(req: e.Request, res: e.Response, next: e.NextFunction) => Promise<any>}
 */
function performanceWrapper(incomingFunction) {

    return async function wrappedFn(req: Request, res: Response, next: NextFunction) {
        const t0 = performance.now();
        console.log(`************** ${incomingFunction.name}-${incomingFunction.class} ${req.originalUrl} *****************`);
        return incomingFunction.apply(this, arguments).then(() => {
            const t1 = performance.now();
            console.log(`time taken to fulfill ${incomingFunction.name}-${incomingFunction.class} ${req.originalUrl} request in milliseconds - ${(t1 - t0)}`)
        });
    };
}

export default performanceWrapper;
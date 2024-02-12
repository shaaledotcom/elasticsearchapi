import {Application, Request, Response} from 'express';
import tryCatchWrapper from '../lib/try_catch_wrapper';
import Base from './Base';
import * as responseHandler from "../lib/response-handler";
import db from "../firebase/db";
import performanceWrapper from "../lib/performance_wrapper";
import { RedisClientType } from 'redis';
import { CacheClass } from '../cache/cacheClass';

/**
 * Ping controller
 */
export default class PingController extends Base {

    constructor(express: Application) {
        super();
        this.register(express);
        const registerArray: { func: any, value: string }[] = [{func: this.getPing, value: 'getPing'}];
        this.registerFunctionProperties(registerArray);
    }

    public register(express: Application): void {
        express.use('/ping', this.router);
        this.router.get('/', tryCatchWrapper(performanceWrapper(this.getPing)));
    }

    public getPing = async (req: Request, res: Response): Promise<any> => {
        await db(process.env.KEY).then((value => {
            console.log(`db enabled on - ${value.enabledDate.toLocaleString()}`);
        }));
    
        // const client: RedisClientType = await CacheClass.getInstance().getRedisCache();
        // await client.ping()
        //     .then(value => console.log(`redis-ping-ok - ${new Date().toISOString()} - ${value}`))
        //     .catch(error => console.log(`redis-ping-error - ${new Date().toISOString()} - ${error}`));
    
        res.locals.data = {result: 'ok'};
        responseHandler.sendResponse(res);
    }
}

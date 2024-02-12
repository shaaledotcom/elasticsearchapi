import * as http from 'http';
import {AddressInfo} from 'net';
// import { setGlobalEnvironment } from './global';
import App from './App';
// import Environment from './environments/environment';
import db from './firebase/db';
import {ShaaleHeaders} from "./middlewares/geo";
import {CacheClass} from "./cache/cacheClass";
// const env: Environment = new Environment();
// setGlobalEnvironment(env);
const app: App = new App();
let server: http.Server;

const PORT: number = 8080;

declare global {
    namespace Express {
        export interface Request {
            shaaleHeaders: ShaaleHeaders;
            uid: string;
            idTokenRef: string;
            deviceIdRef: string;
            loginType: string;
            sessionToken: string;
            deviceType: string | 'web-app' | 'tablet-app' | 'television-app' | 'android-app' | 'ios-app';
            email: string;
            name: string;
            phone: string;
            isProducer: boolean;
            isMobile: boolean;
            isIndia: boolean;
            userData: any;
        }
    }
}

export interface SocketRequest {
    shaaleHeaders: ShaaleHeaders;
    uid: string;
    idTokenRef: string;
    deviceIdRef: string;
    loginType: string;
    sessionToken: string;
    deviceType: string | 'web-app' | 'tablet-app' | 'television-app' | 'android-app' | 'ios-app';
    email: string;
    name: string;
    phone: string;
    isProducer: boolean;
    isAuthenticated: boolean;
    socketId: string;
}

function serverError(error: NodeJS.ErrnoException): void {
    if (error.syscall !== 'listen') {
        throw error;
    }
    // handle specific error codes here.
    throw error;
}

function serverListening(): void {
    const addressInfo: AddressInfo = <AddressInfo>server.address();
    console.info(`elasticsearch api Listening on ${addressInfo.address}:${PORT}`);
}

// async function test(){
//     const client: RedisClientType = await CacheClass.getInstance().getRedisCache();
// }

(async () => {
    await db(process.env.KEY);

    const promises: Promise<any>[] = [];
    promises.push(CacheClass.getInstance().getRedisCache());

    await Promise.all(promises)
        .then(async (values) => {
            console.log("initialized Items");
        })
        .catch((e) => {
            console.log('unable to get initial items', e);
        });
})().then(() => app.init().then(() => {
    app.express.set('port', PORT);

    server = app.httpServer; // http.createServer(App);
    server.on('error', serverError);
    server.on('listening', serverListening);
    server.listen(PORT);
}).catch((err: Error) => {
    console.info('app.init error');
    console.error(err.name);
    console.error(err.message);
    console.error(err.stack);
}));


process.on('unhandledRejection', (reason: Error) => {
    console.error('Unhandled Promise Rejection: reason:', reason.message);
    console.error(reason.stack);
    // application specific logging, throwing an error, or other logic here
});


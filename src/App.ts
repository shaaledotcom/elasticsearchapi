import cors from 'cors';
import express from 'express';
import http from 'http';
import helmet from 'helmet';
import registerRoutes from './routes';
import addErrorHandler from './middlewares/error-handler';
// import logger from "./lib/logger";
import auth from "./middlewares/auth";
import geo from "./middlewares/geo";

export default class App {
    public express: express.Application;

    public httpServer: http.Server;

    private allowedOrigins = ["http://localhost:4200", "http://localhost:4300",
        'https://shaale.com', 'https://dev.shaale.com', 'https://prod-staging-shaale.web.app', 'https://new.api.shaale.com', 'https://new.shaale.com', 'https://website-staging-75ahfsfrkq-el.a.run.app', 'https://www.shaale.com',];

    public async init(): Promise<void> {
        this.express = express();
        this.httpServer = http.createServer(this.express);
        this.middleware();
        this.routes();
        this.addErrorHandler();
    }

    /**
     * here register your all routes
     */
    private routes(): void {
        // this.express.get('/', this.basePathRoute);
        // this.express.get('/web', this.parseRequestHeader, this.basePathRoute);
        registerRoutes(this.express);
    }

    /**
     * here you can apply your middlewares
     */
    private middleware(): void {
        // support application/json type post data
        // support application/x-www-form-urlencoded post data
        // Helmet can help protect your app from some well-known web vulnerabilities by setting HTTP headers appropriately.
        // this.express.use(helmet({contentSecurityPolicy: false}));
        this.express.use(express.json({limit: '100mb'}));
        this.express.use(express.urlencoded({limit: '100mb', extended: true}));
        this.express.use(cors({
            origin: this.allowedOrigins, preflightContinue: false, credentials: true,
        }));
        this.express.use(auth);
        this.express.use(geo);
    }

    private parseRequestHeader(req: express.Request, res: express.Response, next: Function): void {
        // parse request header
        // console.log(req.headers.access_token);
        next();
    }

    private basePathRoute(request: express.Request, response: express.Response): void {
        console.log('test message change');
        response.json({message: 'base path'});
    }

    private addErrorHandler(): void {
        this.express.use(addErrorHandler);
    }
}

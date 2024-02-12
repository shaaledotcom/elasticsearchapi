import * as express from 'express';
import PingController from "./controller/ping.controller";
import SongIndexController from './controller/songIndex.controller';

export default function registerRoutes(app: express.Application): void {
    new PingController(app);
    new SongIndexController(app);
}

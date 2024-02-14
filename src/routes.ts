import * as express from 'express';
import PingController from "./controller/ping.controller";
import SongIndexController from './controller/songIndex.controller';
import SearchIndexController from './controller/searchIndex.controller';

export default function registerRoutes(app: express.Application): void {
    new PingController(app);
    new SongIndexController(app);
    new SearchIndexController(app);
}

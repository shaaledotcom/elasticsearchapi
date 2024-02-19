import { Application, NextFunction, Request, Response } from 'express';
import { sendResponse } from '../lib/response-handler';
import tryCatchWrapper from '../lib/try_catch_wrapper';
import Base from './Base';
import performanceWrapper from "../lib/performance_wrapper";
import { getAllSongsHomeDetailFromRedis } from "./functions/cache_functions";
import console from "console";
import { key } from "../firebase/key";
import { Client } from '@elastic/elasticsearch';

export default class SongIndexController extends Base {

    constructor(express: Application) {
        super();
        this.register(express);
        const registerArray: { func: any, value: string }[] = [
            { func: this.getInfo, value: 'getInfo' },
            { func: this.createIndex, value: 'createIndex' },
        ];
        this.registerFunctionProperties(registerArray);
    }

    public register(express: Application): void {
        express.use('/song-index/', this.router);
        this.router.get('/info', tryCatchWrapper(performanceWrapper(this.getInfo)));
        this.router.get('/create', tryCatchWrapper(performanceWrapper(this.createIndex)));
    }

    public async getInfo(req: Request, res: Response, next: NextFunction): Promise<void> {
        let elastic_conf = await key('ELASTIC_CONF')

        const client = new Client({
            cloud: {
                id: elastic_conf["id"]
            },
            auth: {
                username: elastic_conf["username"],
                password: elastic_conf["password"]
            }
        });
        const info: any = await client.info();
        console.log(info);
        res.locals.data = { result: 'ok', info: info.body }
        sendResponse(res);
    }

    public async createIndex(req: Request, res: Response, next: NextFunction): Promise<void> {
        let elastic_conf = await key('ELASTIC_CONF')

        const client = new Client({
            cloud: {
                id: elastic_conf["id"]
            },
            auth: {
                username: elastic_conf["username"],
                password: elastic_conf["password"]
            }
        });
        const info = await client.info();
        const allSongs = await getAllSongsHomeDetailFromRedis();
        await client.indices.create({
            index: 'song-home',
            body: {
                mappings: {
                    properties: {
                        songDetails: {
                            type: 'object',
                            dynamic: true
                        },
                        data: {
                            type: 'object',
                            properties: {
                                lessons: {
                                    type: 'nested',
                                    properties: {
                                        data: {
                                            type: 'nested',
                                            properties: {
                                                categories: {
                                                    type: 'nested',
                                                    properties: {
                                                        id: {
                                                            type: 'keyword'
                                                        },
                                                        value: {
                                                            type: 'text',
                                                            fields: {
                                                                keyword: {
                                                                    type: 'keyword',
                                                                    ignore_above: 256
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                },
                                practice: {
                                    type: 'nested',
                                    properties: {
                                        data: {
                                            type: 'nested',
                                            properties: {
                                                categories: {
                                                    type: 'nested',
                                                    properties: {
                                                        id: {
                                                            type: 'keyword'
                                                        },
                                                        value: {
                                                            type: 'text',
                                                            fields: {
                                                                keyword: {
                                                                    type: 'keyword',
                                                                    ignore_above: 256
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                },
                            }
                        }
                    }
                }
            }
        });


        const result = await client.helpers.bulk({
            datasource: allSongs,
            onDocument(doc) {
                return {
                    index: {
                        _index: 'song-home',
                    }
                }
            }
        })
        res.locals.data = { result: 'ok', data: result }
        sendResponse(res);
    }
}


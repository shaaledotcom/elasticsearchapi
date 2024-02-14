import { Application, NextFunction, Request, Response } from 'express';
import { sendResponse } from '../lib/response-handler';
import tryCatchWrapper from '../lib/try_catch_wrapper';
import Base from './Base';
import performanceWrapper from "../lib/performance_wrapper";
import { getAllMetatagBodyResultsFromRedis } from "./functions/cache_functions";
import console from "console";
import { key } from "../firebase/key";
import { Client } from '@elastic/elasticsearch';

export default class SearchIndexController extends Base {

    constructor(express: Application) {
        super();
        this.register(express);
        const registerArray: { func: any, value: string }[] = [
            { func: this.getInfo, value: 'getInfo' },
            { func: this.createIndex, value: 'createIndex' },
            { func: this.search, value: 'search' }
        ];
        this.registerFunctionProperties(registerArray);
    }

    public register(express: Application): void {
        express.use('/search-index/', this.router);
        this.router.get('/info', tryCatchWrapper(performanceWrapper(this.getInfo)));
        this.router.get('/create', tryCatchWrapper(performanceWrapper(this.createIndex)));
        this.router.post("/get", tryCatchWrapper(performanceWrapper(this.search)));
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
        const allContent = await getAllMetatagBodyResultsFromRedis();
        await client.indices.create({
            index: 'main-search',
            body: {
                mappings: {
                    properties: {
                        title: {
                            type: 'text',
                        },
                        id: {
                            type: 'keyword'
                        },
                        data: {
                            dynamic: true,
                            type: "nested",
                        },

                    }
                }
            }
        })

        const result = await client.helpers.bulk({
            datasource: allContent,
            onDocument(doc) {
                return {
                    index: {
                        _index: 'main-search',
                    }
                }
            }
        })
        res.locals.data = { result: 'ok', data: result }
        sendResponse(res);
    }

    public search = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        let elastic_conf = await key('ELASTIC_CONF')
        const searchTerm = req.query.searchTerm as string;
        const categoryFilter = req.body.categoryFilter;
        const typeFilter = req.body.type;
        const featuredTagFilter = req.body.featuredTags;
        const profileFilter = req.body.profiles;
        const ageFilter = req.body.age;
        const genderFilter = req.body.gender;
        const languageFilter = req.body.language;
        const openToFilter = req.body.openTo;

        const filters = []
        const client = new Client({
            cloud: {
                id: elastic_conf["id"]
            },
            auth: {
                username: elastic_conf["username"],
                password: elastic_conf["password"]
            }
        });

        let queryObject: any = {
            index: 'main-search',
            body: {
                query: {
                    nested: {
                        path: "data",
                        query: {
                            bool: {
                                must: [
                                    {
                                        fuzzy: {
                                            "data.title": {
                                                value: searchTerm.toLowerCase(),
                                                fuzziness: "AUTO",
                                                prefix_length: 0,
                                                max_expansions: 50
                                            }
                                        }
                                    }
                                ]
                            }
                        },
                        inner_hits: {}
                    }
                }
            }
        };

        const searchResult = await client.search(queryObject);

        const hits = searchResult.hits.hits;
        let processedResults = hits.map(hit => {
            const clonedHit = JSON.parse(JSON.stringify(hit));
            if (hit.inner_hits && hit.inner_hits.data) {
                const matchingDataItems = hit.inner_hits.data.hits.hits.map(innerHit => innerHit._source);
                clonedHit._source.data = matchingDataItems;
                clonedHit._source.count = matchingDataItems.length;
            }

            return clonedHit._source;
        });

        const filtersList = [
            { filterValues: categoryFilter, propertyExtractor: data => data.flatMap(d => d.categories?.map(c => c.value)) },
            { filterValues: typeFilter, propertyExtractor: data => data.flatMap(d => d.type) },
            { filterValues: featuredTagFilter, propertyExtractor: data => data.flatMap(d => d.featuredTags) },
            { filterValues: profileFilter, propertyExtractor: data => data.flatMap(d => d.profiles?.map(p => p.name)) },
            { filterValues: ageFilter, propertyExtractor: data => data.flatMap(d => d?.age) },
            { filterValues: genderFilter, propertyExtractor: data => data.flatMap(d => d?.gender) },
            { filterValues: languageFilter, propertyExtractor: data => data.flatMap(d => d?.language) },
            { filterValues: openToFilter, propertyExtractor: data => data.flatMap(d => d?.openTo) },
        ];

        function matchesFilter(data, filterValues, propertyExtractor) {
            if (!filterValues || filterValues.length === 0) {
                return true;
            }
            const values = propertyExtractor(data);
            return values.some(value => filterValues.includes(value));
        }

        processedResults = processedResults.filter((result) =>
            filtersList.every(({ filterValues, propertyExtractor }) =>
                matchesFilter(result.data, filterValues, propertyExtractor)
            )
        );

        const categories = processedResults.flatMap(result => result.data.flatMap(data => data.categories)).filter((category, index, self) =>
            index === self.findIndex((t) => t?.id === category?.id)
        ).filter((category) => category)
        if (categories.length > 0) {
            filters.push({
                name: 'Category',
                value: categories.map((category) => category.value).filter((category) => category),
                id: "category"
            })
        }

        const type = processedResults.flatMap((result) => result.data.flatMap((data) => data.type)).filter((type, index, self) =>
            index === self.findIndex((t) => t === type)
        ).filter((type) => type)
        if (type.length > 0) {
            filters.push({
                name: 'Type',
                value: type,
                id: "type"
            })
        }

        const featuredTags = processedResults.flatMap((result) => result.data.flatMap((data) => data?.featuredTags)).filter((featuredTag, index, self) =>
            index === self.findIndex((t) => t === featuredTag)).filter((featuredTag) => featuredTag)

        if (featuredTags.length > 0) {
            filters.push({
                name: 'Featured Tags',
                value: featuredTags,
                id: "featuredTags"
            })
        }

        const profiles = processedResults.flatMap(result => result.data.flatMap(data => data.profiles)).filter((profile, index, self) =>
            index === self.findIndex((t) => t?.id === profile?.id)
        ).filter((profile) => profile)
        if (profiles.length > 0) {
            filters.push({
                name: 'Profiles',
                value: profiles.map((profile) => profile.name).filter((profile) => profile),
                id: "profiles"
            })
        }

        res.locals.data = { result: 'ok', data: processedResults, filters }
        sendResponse(res);
    }
}

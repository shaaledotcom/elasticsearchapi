import * as fs from 'fs';
import {performance} from "perf_hooks";
import {parse, stringify} from 'flatted';
import db from "./firebase/db";
import {firestore} from "firebase-admin";
import Api from "./firebase/api";
import * as express from 'express';
import {AllCacheInterface, CacheClass} from "./cache/cacheClass";
import * as moment from "moment";
import CategoryIndexCache from "./cache/category_index_cache";
import {CategoryIndexInterface} from "./cache/category_index_interface";

export class Utils {
    public static async readHTMLFile(path1: any, callback: any,) {
        fs.readFile(path1, {encoding: 'utf-8'}, function (err, html) {
            if (err) {
                console.log(err);
                callback(err);
                throw err;
            } else {
                callback(null, html);
            }
        });
    }

    public static capitalize(word) {
        if (word === undefined || word === null) {
            return;
        }
        return word[0].toUpperCase() + word.substring(1).toLowerCase();
    }


    /**
     * Convert firebase/ string date to normal JS Date
     * @param date
     * @return {null | Date}
     */
    public static getDate(date: any) {
        try {
            return (date as firestore.Timestamp).toDate();
        } catch (e) {
            try {
                return new firestore.Timestamp(date._seconds,date._nanoseconds).toDate();
            } catch (e) {
                return null;
            }
        }
    }

    public static async getCategoryIndexFromCloud():Promise<CategoryIndexInterface []> {
        try {
            const fBaseHelper = new Api();
            const doc: FirebaseFirestore.QueryDocumentSnapshot = await fBaseHelper.getCategoryIndexPath();

            // check if the current path is equal to the recent doc id if not get the latest indexes
            if (CategoryIndexCache.currentPath === undefined || (doc !== null && CategoryIndexCache.currentPath !== doc.id)) {
                CategoryIndexCache.currentPath = doc.id;
                console.log('getting index from cloud');
                await this.checkIndexFromCloud(doc.data());
            }
            // the reason why we are stringify and then parse is because this will deep copy the category index.
            // this is required since get_categories removes all children and only retains direct children for of a parent.
            // this in turn would effect get_details since there are less children than originally present.
            // when we deep copy, any manipulation of the deep copy array does not affect the cache category index
            return parse(stringify(CategoryIndexCache.categoryIndex));
        } catch (e) {
            console.error('unable to get category index document', e);
            return;
        }
    }

    private static async checkIndexFromCloud(map: any) {
        const t0 = performance.now();
        const bucket = await (await db(process.env.KEY)).admin.storage().bucket(Utils.categoryIndexBucket())
        const categoryIndex = bucket.file(map.categoryIndex);
        const categoryIndexBuffer: any = await this.getCategoryIndex(categoryIndex);
        CategoryIndexCache.categoryIndex = parse(categoryIndexBuffer);
        const t1 = performance.now();
        console.log('time taken to get index from cloud and load - ', (t1 - t0), ' milliseconds.');
        return CategoryIndexCache.categoryIndex;
    }

    private static async getCategoryIndex(categoryIndex: any) {
        return new Promise((resolve, reject) => {
            let categoryIndexBuffer = '';
            categoryIndex.createReadStream()
                .on('error', function (err) {
                    console.log(err)
                })
                .on('data', function (response) {
                    categoryIndexBuffer += response
                    // console.log("response: ", response, 'buffer', buffer);
                })
                .on('end', function () {
                    // console.log(buffer);
                    // console.log("allItemsBuffer: ", allItemsBuffer);
                    resolve(categoryIndexBuffer);
                });
        });
    }

    private static categoryIndexBucket(): string {
        return process.env.KEY === 'prod' ? 'category-index-storage-prod' : 'category-index-storage'
    };

    public static setCache(res: express.Response, type: string) {
        switch (type) {
            case 'standard':
                res.set('Cache-Control', 'private, max-age=60, s-maxage=60');
                break;
            case 'private':
                res.set('Cache-Control', 'private, no-store');
                break;
        }
    }


    public static async getCacheFromCloud():Promise<AllCacheInterface> {
        try {
            const fBaseHelper = new Api();
            const doc: FirebaseFirestore.QueryDocumentSnapshot = await fBaseHelper.getCacheStoragePath();

            // check if the current path is equal to the recent doc id if not get the latest indexes
            if (CacheClass.allCache === undefined || (doc !== null && CacheClass.currentPath !== doc.id)) {
                CacheClass.currentPath = doc.id;
                console.log('getting cache from cloud');
                await this.checkCacheFromCloud(doc.data());
            }
            // the reason why we are stringify and then parse is because this will deep copy the category index.
            // this is required since any API deep copy, any manipulation of the deep copy array does not affect the cache category index
            return parse(stringify(CacheClass.allCache));
        } catch (e) {
            console.error('unable to get cache document', e);
            return;
        }
    }

    private static async checkCacheFromCloud(map: any) {
        const t0 = performance.now();
        const bucket = await (await db(process.env.KEY)).admin.storage().bucket(CacheClass.getInstance().cacheIndexBucket)
        const cacheIndex = bucket.file(map.cacheIndex);
        const cacheIndexBuffer: any = await this.getCache(cacheIndex);
        const temp: AllCacheInterface = parse(cacheIndexBuffer);
        Object.values(temp).forEach((item: any) => {
            item.threshold = moment.duration(item.threshold)
        })
        CacheClass.allCache = temp;
        const t1 = performance.now();
        console.log('time taken to get cache from cloud and load - ', (t1 - t0), ' milliseconds.');
        return CacheClass.allCache;
    }

    private static async getCache(cacheIndex: any) {
        return new Promise((resolve, reject) => {
            let cacheIndexBuffer = '';
            cacheIndex.createReadStream()
                .on('error', function (err) {
                    console.log(err)
                })
                .on('data', function (response) {
                    cacheIndexBuffer += response
                    // console.log("response: ", response, 'buffer', buffer);
                })
                .on('end', function () {
                    // console.log(buffer);
                    // console.log("allItemsBuffer: ", allItemsBuffer);
                    resolve(cacheIndexBuffer);
                });
        });
    }
}

/**
 * Group object array by property
 * Example, groupBy(array, ( x: Props ) => x.id );
 * @param array
 * @param property
 */
export const groupBy = <T>(array: Array<T>, property: (x: T) => string): { [key: string]: Array<T> } =>
    array.reduce((memo: { [key: string]: Array<T> }, x: T) => {
        if (!memo[property(x)]) {
            memo[property(x)] = [];
        }
        memo[property(x)].push(x);
        return memo;
    }, {});

export default groupBy;
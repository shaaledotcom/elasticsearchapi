import * as moment from 'moment';
import {createClient, RedisClientType} from 'redis';
import {EventDetailInterface} from './event_detail_interface';
import {HomePageBodyDataInterface, HomePageBodyInterface, HomePageListInterface} from './home_page_interface';
import {HomeSliderData} from './home_slider_data';
import {ItemChapterPlayListDetail, ItemDetailInterface, ItemLanguage} from './item_detail_interface';
import {ItemMediaInterface} from './item_media_interface';
import {PlaylistInterface} from './playlist_interface';
import {ProfileHomeInterface} from './profile_home_interface';
import {ProfileTypeInterface} from './profile_type_interface';
import {ShaaleSubscriptionInterface} from './shaale_subscription_interface';

export interface AllCacheInterface {
    homeSlider: { timeStamp: Date, value: HomeSliderData[], threshold: moment.Duration },
    courses: { timeStamp: Date, value: ItemDetailInterface[], threshold: moment.Duration },
    events: { timeStamp: Date, value: EventDetailInterface[], threshold: moment.Duration },
    videos: { timeStamp: Date, value: ItemMediaInterface[], threshold: moment.Duration },
    audios: { timeStamp: Date, value: ItemMediaInterface[], threshold: moment.Duration },
    profiles: { timeStamp: Date, value: ProfileHomeInterface[], threshold: moment.Duration },
    playlists: { timeStamp: Date, value: PlaylistInterface[], threshold: moment.Duration },
    courseVideos: { timeStamp: Date, value: ItemChapterPlayListDetail[], threshold: moment.Duration },
    subscription: { timeStamp: Date, value: ShaaleSubscriptionInterface, threshold: moment.Duration }
    homeBody?: { timeStamp: Date, value: HomePageBodyInterface[], threshold: moment.Duration },
    homePageLists?: { timeStamp: Date, value: HomePageListInterface[], threshold: moment.Duration },
    allCourses?: { timeStamp: Date, value: HomePageBodyDataInterface[], threshold: moment.Duration },
    profileTypes: { timeStamp: Date, value: ProfileTypeInterface[], threshold: moment.Duration },
    languages: { timeStamp: Date, value: ItemLanguage[], threshold: moment.Duration },
    // version: { timeStamp: Date, value: VersionInterface[], threshold: moment.Duration },
}

export interface UserCache {
    uid: string,
    userDocumentData: any;
    timeStamp: Date,
}

export class CacheClass {
    /**
     * The static method that controls the access to the singleton instance.
     *
     * This implementation let you subclass the Casting class while keeping
     * just one instance of each subclass around.
     */
    public static getInstance(): CacheClass {
        if (!CacheClass.instance) {
            CacheClass.instance = new CacheClass();
        }

        return CacheClass.instance;
    }

    private static instance: CacheClass;

    public static allCache: AllCacheInterface;

    public static currentPath: string;

    public static userCache: UserCache[] = [];

    // /**
    //  * The Singleton's constructor should always be private to prevent direct
    //  * construction calls with the `new` operator.
    //  */
    // private constructor() {
    // }


    private _client: RedisClientType;

    get cacheIndexBucket(): string {
        return process.env.KEY === 'prod' ? 'cache-storage-prod' : 'cache-storage-dev';
    };

    public async getRedisCache(): Promise<RedisClientType> {
        if (this._client === undefined || !this._client.isOpen) {
            this._client = this.getClient();
            // this._client = createClient();
            this._client.on('error', async (err) => {
                console.log('redis-client-error', err);
                await this._client.quit();
                this._client = this.getClient();
                await this._client.connect();
            });
            this._client.on('ready', () => console.log('redis-client-ready'));
            this._client.on('reconnecting', () => console.log('redis-client-reconnecting'));
            this._client.on('end', async () => {
                console.log('redis-client-ended-connecting');
                this._client = this.getClient();
                await this._client.connect();
            });
            await this._client.connect();
        }
        return this._client;
    }

    private getClient(): RedisClientType {
        console.log('redis-client-creating-new-client');
        return createClient({
            // url: `redis://${process.env.REDIS_IP}`,
            // pingInterval: 10000,
            socket: {
                host: process.env.REDIS_IP,
                port: 6379,
                reconnectStrategy(retries, error) {
                    console.log(`Redis reconnecting retries ${retries}`, new Date().toJSON());
                    return 500;
                }
            },
        });
    }

    public static convertToObject(value: any) {
        try {
            // return JSON.parse(JSON.stringify(value));
            return JSON.parse(value);
        } catch (e) {
            return null;
        }
    }
}

export interface RedisResult {
    'total': number,
    'documents': { 'id': string, 'value': any }
}

export const profileCacheIndex = 'idx:profile_index';
export const profileFieldKey = '@url:';
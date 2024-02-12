import {RedisClientType} from "redis";
import {CacheClass} from "../../cache/cacheClass";
import {ProfileHomeInterface} from "../../cache/profile_home_interface";
import {HomePageBodyDataInterface} from "../../cache/home_page_interface";
import {ItemChapterPlayListDetail, ItemDetailInterface} from "../../cache/item_detail_interface";
import {SubscriptionDetailsInterface} from "../../cache/shaale_subscription_interface";
import {ItemMediaInterface} from "../../cache/item_media_interface";


async function getVideoFromRedis(input: string) {
    const client: RedisClientType = await CacheClass.getInstance().getRedisCache();
    const value = await client.get(`video:${input}`);
    const video: ItemMediaInterface = CacheClass.convertToObject(value);
    if (video === undefined || video === null) {
        return null;
    }
    return video;
}

async function getSubscriptionFromRedis(input: string) {
    const client: RedisClientType = await CacheClass.getInstance().getRedisCache();
    const value = await client.get(`subscription:${input}`);
    const subscription: SubscriptionDetailsInterface = CacheClass.convertToObject(value);
    if (subscription === undefined || subscription === null) {
        return null;
    }
    return subscription;
}

async function getAllSubscriptionFromRedis() {
    const client: RedisClientType = await CacheClass.getInstance().getRedisCache();
    const value = await client.get(`subscription:ALL`);
    const subscription: SubscriptionDetailsInterface[] = CacheClass.convertToObject(value);
    if (subscription === undefined || subscription === null) {
        return null;
    }
    return subscription;
}

async function getUserListDataInRedis(uid: string, type: string) {
    const client: RedisClientType = await CacheClass.getInstance().getRedisCache();
    const value = await client.get(`user_list:${uid}:${type}`);
    const list: string[] = CacheClass.convertToObject(value);
    if (list === undefined || list === null) {
        return null;
    }
    return list;
}
async function getAllAudioFromRedis() {
    const client: RedisClientType = await CacheClass.getInstance().getRedisCache();
    const value = await client.get(`audio:ALL`);
    const audioList: ItemMediaInterface[] = CacheClass.convertToObject(value);
    if (audioList === undefined || audioList === null) {
        return null;
    }
    return audioList;
}

async function getAudioFromRedis(input: string) {
    const client: RedisClientType = await CacheClass.getInstance().getRedisCache();
    const value = await client.get(`audio:${input}`);
    const audio: ItemMediaInterface = CacheClass.convertToObject(value);
    if (audio === undefined || audio === null) {
        return null;
    }
    return audio;
}

async function getUserContinueWatchingInRedis(uid: string) {
    const client: RedisClientType = await CacheClass.getInstance().getRedisCache();
    const value = await client.get(`user_continue_watching:${uid}`);
    const list: HomePageBodyDataInterface[] = CacheClass.convertToObject(value);
    if (list === undefined || list === null) {
        return null;
    }
    return list;
}

async function getAllSongsHomeDetailFromRedis(){
    try {
        const client: RedisClientType = await CacheClass.getInstance().getRedisCache();
        const keys = await client.keys('V1_SongHome:*');
        const songs = [];
        for (const key of keys) {
            const value = await client.get(key);
            const song = CacheClass.convertToObject(value);
            if (song) {
                songs.push(song);
            }
        }
        return songs
    } catch (error) {
        console.error('Failed to retrieve songs from Redis:', error);
        throw error;
    }
}

export {
    getVideoFromRedis,
    getAllSubscriptionFromRedis,
    getSubscriptionFromRedis,
    getUserListDataInRedis,
    getAllAudioFromRedis,
    getAudioFromRedis,
    getUserContinueWatchingInRedis,
    getAllSongsHomeDetailFromRedis
}
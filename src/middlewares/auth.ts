import * as fs from 'fs';
import * as path from 'path';
import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import * as uuid from 'uuid';
import { CacheClass } from '../cache/cacheClass';
import { invalidTokenError } from '../constants';
import Api from '../firebase/api';
import axios from 'axios';

const fBaseHelper = new Api();
const allowedPaths: string[] = ['/ping', '/song-index'];
export default async (req: express.Request, res: express.Response, next) => {
    console.log('request_path_original = ', req.originalUrl, 'request_path_current = ', req.url);
    // set the incoming request device type
    setIncomingRequestDeviceType(req);

    const sessionToken: string = req.headers.authorization;
    let result: boolean;
    if (checkRequestUrl(req.originalUrl)) {
        if (req.headers.authorization) {
            await decodeToken(sessionToken, req, res, false);
            await getUserBasicInfo(req);
            console.log('1 finished authentication middleware process', new Date().toISOString());
        }
        next();
    } else {
        if (!req.headers.authorization) {
            res.status(400).json({ error: invalidTokenError });
            return;
        }
        result = await decodeToken(sessionToken, req, res, true);
        if (result) {
            await getUserBasicInfo(req);
            console.log('2 finished authentication middleware process', new Date().toISOString());
            next();
        }
    }
};

export async function decodeToken(sessionToken: string, req: express.Request, res: express.Response, toSendResponse: boolean) {
    // get the decoded validity expiry uid and idTokenRef
    const decodedValidity: {
        result: boolean, error: any, expiry?: number,
        uid?: string, idTokenRef?: string, loginType?: string, deviceIdRef?: string,
    } = await decodeJwtToken(sessionToken);

    console.log('decodedValidity', decodedValidity);

    // if invalid return false
    if (!decodedValidity.result && toSendResponse) {
        res.status(400).json({ error: invalidTokenError });
        return false;
    }

    const tokenExpired: boolean = decodedValidity.expiry < new Date().getTime() / 1000;
    // const expiryDate: Date = Utils.getTokenExpiryDate(decodedValidity.expiry)

    // console.log('tokenExpired', tokenExpired);

    // ** check if token is expired
    if (tokenExpired && toSendResponse) {
        res.status(400).json({ error: invalidTokenError });
        return false;
    }

    req.uid = decodedValidity.uid;
    req.idTokenRef = decodedValidity.idTokenRef;
    req.deviceIdRef = decodedValidity.deviceIdRef;
    req.loginType = decodedValidity.loginType;
    req.sessionToken = sessionToken;
    return true;
}

function setIncomingRequestDeviceType(req: express.Request) {
    if (req.headers.product) {
        const productHeader = req.headers.product;
        switch (productHeader) {
            case 'ios':
                req.deviceType = 'ios-app';
                req.isMobile = true;
                break;
            case 'android':
                req.deviceType = 'android-app';
                req.isMobile = true;
                break;
            case 'television-app':
                req.deviceType = 'television-app';
                break;
            default:
                req.deviceType = 'web-app';
                break;
        }
    } else {
        req.deviceType = 'web-app';
    }
}

function checkRequestUrl(url: string): boolean {
    let result = false;
    allowedPaths.forEach((incomingPath) => {
        // console.log(incomingPath, url, incomingPath === url, url.includes(incomingPath), incomingPath === url || url.includes(incomingPath))
        if ((incomingPath === url || url.includes(incomingPath)) && !url.includes('purchase')) {
            result = true;
        }
    });
    // console.log('result', result);
    return result;
}

export async function getUserBasicInfo(req: express.Request) {
    let addToCache: boolean = false;

    const client = await CacheClass.getInstance().getRedisCache();
    const value = await client.get(`userData:${req.uid}`);

    let userData: any;
    // const value = null;
    if (value === null) {
        try {
            userData = await fBaseHelper.getUserDocumentFromUid(req.uid);
            addToCache = true;
            console.log('getting user data from db');
        } catch (e) {
            console.log('error getting user info in auth middleware');
            userData = null;
        }
    } else {
        userData = CacheClass.convertToObject(value);
        console.log('getting user data from cache');
    }

    req.userData = userData;

    // if (userData !== null) {
    //     req.headers['x-shaale-auth-authenticated'] = 'yes';
    //     req.headers['x-shaale-auth-userid'] = userData.firebaseId;
    //     req.headers['x-shaale-auth-email'] = userData.primaryEmail;
    //     req.headers['x-shaale-auth-phone'] = userData.phone;
    //     req.headers['x-shaale-auth-name'] = userData.name;
    //     req.headers['x-shaale-auth-producer'] = userData.isProducer;
    // } else {
    //     req.headers['x-shaale-auth-authenticated'] = 'no';
    // }

    if (addToCache) {
        updateUserDataInRedis(req.uid, userData);
        // // await client.json.set(`sessionToken:${unique}`, '.', JSON.parse(JSON.stringify(sessionTokenValue)));
        // await client.set(`userData:${req.uid}`, JSON.stringify(userData));
        // console.log('user data added to redis cache', req.uid);
    }
}

/**
 * check if session token is active
 * @param sessionToken
 * @param uid
 * @returns {Promise<boolean>}
 */
async function checkSessionToken(sessionToken: string, uid: string): Promise<boolean> {
    let sessionTokenValue: { isActive: boolean } = { isActive: false };

    let addToCache: boolean = false;
    const client = await CacheClass.getInstance().getRedisCache();
    const unique = createCacheSessionId(sessionToken);
    // const value = await client.json.get(`sessionToken:${unique}`);
    const value = await client.get(`sessionToken:${unique}`);

    // const value = null;

    // if session token information is not present in cache, get it from the db
    if (value === null) {
        const sessionTokenDoc: FirebaseFirestore.DocumentSnapshot =
            await fBaseHelper.getSessionTokenDocument(uid, sessionToken);
        if (!sessionTokenDoc) {
            console.log('session token document does not exist', sessionToken);
            return false;
        }
        sessionTokenValue.isActive = sessionTokenDoc.data().isActive;
        addToCache = true;
    } else {
        sessionTokenValue = CacheClass.convertToObject(value);
        console.log('createCacheSessionId', sessionTokenValue);
    }

    // if (addToCache) {
    //     // await client.json.set(`sessionToken:${unique}`, '.', JSON.parse(JSON.stringify(sessionTokenValue)));
    //     await client.set(`sessionToken:${unique}`, JSON.stringify({isActive: true}));
    //     console.log('session data added to redis cache', uid);
    // }

    if (!sessionTokenValue.isActive) {
        console.log('session token is not active', sessionToken);
        return false;
    }
    console.log('session token is active');
    return true;
}

const dateOfInc = new Date('2018-11-20');

const nameSpace: string = uuid.v1({
    node: [0x01, 0x20, 0x43, 0x77, 0x91, 0xba],
    clockseq: 0x1118, msecs: dateOfInc.getTime(),
    nsecs: 1118,
});

export function createCacheSessionId(sessionToken: string): string {
    const name: string = JSON.stringify(sessionToken);
    const uniqueId: string = uuid.v5(name, nameSpace);
    // Utils.showLogsInConsole(showLogs, 'createDeviceId', ['nameSpace', nameSpace, 'uniqueId', uniqueId]);
    return uniqueId;
}

/**
 * verify and decode token - check expiry, isActive
 * @param token
 * @returns {Promise<{result: boolean, error: string} | {result: boolean, uid: any, loginType: any, expiry: any, error: null, idTokenRef: any}>}
 */
export async function decodeJwtToken(token: string): Promise<{
    result: boolean, error: any, expiry?: number
    uid?: string, idTokenRef?: string, loginType?: string, deviceIdRef?: string,
}> {
    const check: { result: boolean, error: any } = verifyToken(token);
    // console.log('verify check', check);
    const decoded: any = jwt.decode(token);
    // console.log('decoded token data', decoded);
    if (check.result) {
        if (!await checkSessionToken(token, decoded.uid)) {
            return { result: false, error: 'REAUTHENTICATE' };
        }

        return {
            result: true,
            error: null,
            expiry: decoded.exp,
            uid: decoded.uid,
            loginType: decoded.loginType,
            idTokenRef: decoded.idToken,
            deviceIdRef: decoded.deviceIdRef
        };
    }
    console.log('SESSION_TOKEN_VERIFICATION_FAILED',
        'sessionToken', token);
    return { result: false, error: 'REAUTHENTICATE' };

}


/**
 * verify if session token is valid
 * @returns {{result: boolean, error: null} | {result: boolean, error: string}}
 * @param token
 */
function verifyToken(token: string): any {
    let publicKEY: string;
    publicKEY = fs.readFileSync(path.join(`${__dirname}../../keys/shaale.key.pub`), 'utf8').replace(/\\n/gm, '\n');
    // if (process.env.LOCAL === 'yes') {
    //     publicKEY = fs.readFileSync(path.join(`${__dirname}../../keys/shaale.key.pub`), 'utf8').replace(/\\n/gm, '\n');
    // } else {
    //     // since keys are copied in build folder
    //     publicKEY = fs.readFileSync(path.join(`${__dirname}../keys/shaale.key.pub`), 'utf8').replace(/\\n/gm, '\n');
    // }
    // console.log(publicKEY);
    // console.log('session Token', req.headers.token)
    try {
        jwt.verify(token, publicKEY);
    } catch (e) {
        if (e instanceof jwt.TokenExpiredError) {
            const err: jwt.TokenExpiredError = (e as jwt.TokenExpiredError);
            console.log('SESSION_TOKEN_EXPIRED', token);
            return { result: false, error: err.name };
        }
        return { result: false, error: 'unknown' };
    }
    return { result: true, error: null };
}


async function getUrlList(): Promise<string[]> {
    let urlList: string[] = [];
    try {
        urlList = process.env.redisCacheApiUrlList.split(",");
        console.log('redisCacheApiUrlList', urlList);
    } catch (e) {
        console.log('no redisCacheApiUrlList');
    }
    return urlList;
}


async function updateUserDataInRedis(uid: string, userData: any) {
    const urlList: string[] = await getUrlList();
    if (urlList.length === 0) {
        console.error('url list is empty, failed to update user info in redis successfully for uid', uid);
    }
    const promises: Promise<any>[] = [];
    urlList.forEach(url => promises.push(axios.post(`${url}/update/cache/user/${uid}/add`, userData)));
    await Promise.all(promises)
        .then(async (values) => {
            console.log('updated user info in redis successfully for uid', uid);
            return values;
        })
        .catch((e) => {
            console.error('failed to update user info in redis successfully for uid', uid, e.toString());
        });
}
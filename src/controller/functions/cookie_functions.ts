import {cloudfront} from "../../constants";
import {key} from "../../firebase/key";
import * as AWS from "aws-sdk";
import {Response} from "express";

async function createSessionCookie(url: string,res: Response) {

    console.log('url in createSessionCookie', url)
    const cloudfrontAccessKeyId = cloudfront.keyPairAccessId;
    const cloudfrontPrivateKey = (await key('STREAM_KEY'));
    // console.log(cloudfrontPrivateKey);
    const signer = new AWS.CloudFront.Signer(cloudfrontAccessKeyId, cloudfrontPrivateKey);

    // 1 day as milliseconds to use for link expiration - optional
    const expiresMs = 1 * 24 * 60 * 60 * 1000;
    // 10 seconds as milliseconds to use for link valid from - optional
    const startsMs = 10 * 1000;
    // source ipaddress - optional
    const ipAddress = "0.0.0.0";

    // extract the path from the streaming url for hls folder
    const splitString: string[] = url.split('/');

    // remove the https://vod.shaale.com
    splitString.splice(0, 3);
    // reverse
    splitString.reverse();

    // remove the file name and hls form path
    splitString.splice(0, 2);

    // reverse back to proper order
    splitString.reverse();

    // https://ls1.shaale.com/out/v1/2663930e0baf426a98acfc1c4f4a1fdf/index.m3u8
    // https://vod.shaale.com/59510949-26fd-44d6-a222-708c5f59b2fd/hls/Shaale-Platform-Promo.m3u8
    // join the path with "/"
    const hlsFolder: string = `https://vod.shaale.com/${splitString.join('/')}/hls/*`;
    // "Resource": 'https://ls1.shaale.com/out/v1/2663930e0baf426a98acfc1c4f4a1fdf/*',
    console.log('hlsFolder', hlsFolder);
    console.log('url', url);

    const policy = JSON.stringify({
        "Statement": [
            {
                "Resource": hlsFolder,
                "Condition": {
                    // "DateGreaterThan": {
                    //     "AWS:EpochTime": Math.floor((Date.now() + startsMs) / 1000)
                    // },
                    "DateLessThan": {
                        "AWS:EpochTime": Math.floor((Date.now() + expiresMs) / 1000)
                    },
                    //"IpAddress":{"AWS:SourceIp": ipAddress}
                }
            }
        ]
    });

    // sign a CloudFront URL that expires 2 days from now
    /*const signedUrl = signer.getSignedUrl({
        url: constants.cloudfront.mp4Url,
        expires: Math.floor((Date.now() + expiresMs)/1000), // Unix UTC timestamp for now + 2 days
    });*/

    // const signedCookies = signer.getSignedCookie({
    //     url: cloudfront.hlsUrl,
    //     policy,
    // });

    // const signedCookies = signer.getSignedCookie({policy: policy});
    // @ts-ignore
    const signedCookies = signer.getSignedCookie({
        url: url,
        policy,
    });

    // set the cookies in response
    for (const cookieId in signedCookies) {
        // console.log(cookieId + ": " + signedCookies[cookieId]);
        res.cookie(cookieId, signedCookies[cookieId], {
            domain: cloudfront.domain, httpOnly: true,
            secure: true
        });
    }
}

export {
    createSessionCookie,
}
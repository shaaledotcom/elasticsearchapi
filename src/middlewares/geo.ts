// export default async (req, res, next) => {
//     req.headers['x-shaale-region'] = req.header('x-appengine-region') || 'ka';
//     req.headers['x-shaale-city'] = req.header('x-appengine-city') || 'bengaluru';
//     req.headers['x-shaale-country'] = req.header('x-country-code') || 'IN';
//     req.headers['x-shaale-citylatlong'] = req.header('x-appengine-citylatlong') || '12.9716,77.5946';
//     next();
// };
import {NextFunction, Request, Response} from "express";

export interface ShaaleHeaders {
    xShaaleIp: string;
    xShaaleState: string;
    xShaaleCountry: string;
    xShaaleLatLong: string;
    xShaaleCity: string;
    xShaaleUserAgent: string;
    xShaaleRtt: string;
    xShaaleOrigin: string;
}

function createRequestHeaders(req: Request): ShaaleHeaders {
    return {
        xShaaleIp: req.header('x-forwarded-for') || null,
        xShaaleState: req.header('x-shaale-region') || null,
        xShaaleCountry: req.header('x-shaale-country') || null,
        xShaaleLatLong: req.header('x-shaale-citylatlong') || null,
        xShaaleCity: req.header('x-shaale-city') || null,
        xShaaleUserAgent: req.header('user-agent') || null,
        xShaaleRtt: req.header('x-shaale-rtt') || null,
        xShaaleOrigin: req.header('x-shaale-origin') || null,
    };
}

export default async (req: Request, res: Response, next: NextFunction) => {
    // console.log('req headers', req.headers);

    if (process.env.KEY === 'dev') {
        req.headers.xshaaleip = req.header('x-forwarded-for') || null;
        req.headers.xshaalestate = req.header('x-shaale-region') || null;
        req.headers.xshaalecountry = req.header('x-shaale-country') || null;
        req.headers.xshaalelatlong = req.header('x-shaale-citylatlong') || null;
        req.headers.xshaalecity = req.header('x-shaale-city') || null;
        req.headers.xshaaleuseragent = req.header('user-agent') || null;
        req.headers.xshaalertt = req.header('x-shaale-rtt') || null;
        req.headers.xshaaleorigin = req.header('x-shaale-origin') || null;
    } else {
        req.headers['x-shaale-region'] = req.header('x-appengine-region') || 'ka';
        req.headers['x-shaale-city'] = req.header('x-appengine-city') || 'bengaluru';
        req.headers['x-shaale-country'] = req.header('x-country-code') || 'IN';
        req.headers['x-shaale-citylatlong'] = req.header('x-appengine-citylatlong') || '12.9716,77.5946';
    }
    console.log('req headers country', req.headers['x-shaale-country']);
    req.shaaleHeaders = createRequestHeaders(req);

    req.isIndia = req.shaaleHeaders.xShaaleCountry === 'IN';

    next();
};


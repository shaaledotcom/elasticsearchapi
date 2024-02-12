import {Request} from "express";
import {invalidProfileTypeId, invalidProfileUrl} from "../../constants";
import {ValidationInterface} from "./validation_interface";
import {ProfileHomeInterface} from "../../cache/profile_home_interface";
import {ValidationType} from "./validation_type";
import {Utils} from "../../utils";
import {CacheClass} from "../../cache/cacheClass";
import {ErrorInterface} from "../../ErrorInterface";
import {RedisClientType} from "redis";
import {ItemChapterPlayListDetail, ItemDetailInterface} from "../../cache/item_detail_interface";
import {ItemMediaInterface} from "../../cache/item_media_interface";

function returnTrueWithValue(value: any, type: ValidationType): ValidationInterface {
    return {
        hasError: false,
        error: {code: '', message: ''},
        value: value,
        type: type,
    };
}

function returnTrue(type: ValidationType): ValidationInterface {
    return {
        hasError: false,
        error: {code: '', message: ''},
        type: type,
    };
}

async function invalidUrlInParams(req: Request, error: ErrorInterface): Promise<ValidationInterface> {
    if (req.params.url === undefined || req.params.url.trim().length === 0) {
        return {
            hasError: true,
            error: error,
            type: ValidationType.UrlInParam,
        };
    }
    return returnTrue(ValidationType.UrlInParam);
}

async function invalidIdInParams(req: Request, error: ErrorInterface): Promise<ValidationInterface> {
    if (req.params.id === undefined || req.params.id.trim().length === 0) {
        return {
            hasError: true,
            error: error,
            type: ValidationType.IdInParam,
        };
    }
    return returnTrue(ValidationType.IdInParam);
}

async function invalidEmailInBody(req: Request, error: ErrorInterface): Promise<ValidationInterface> {
    if (req.params.url === undefined || req.params.url.trim().length === 0) {
        return {
            hasError: true,
            error: error,
            type: ValidationType.UrlInParam,
        };
    }
    return returnTrue(ValidationType.UrlInParam);
}

async function invalidUrlInBody(req: Request, error: ErrorInterface): Promise<ValidationInterface> {
    if (req.body.url === undefined || req.body.url.trim().length === 0) {
        return {
            hasError: true,
            error: error,
            type: ValidationType.UrlInBody,
        };
    }
    return returnTrue(ValidationType.UrlInBody);
}

async function invalidNameInBody(req: Request, error: ErrorInterface): Promise<ValidationInterface> {
    if (req.body.name === undefined || req.body.name.trim().length === 0) {
        return {
            hasError: true,
            error: error,
            type: ValidationType.NameInBody,
        };
    }
    return returnTrue(ValidationType.NameInBody);
}

async function invalidOrderIdInBody(req: Request, error: ErrorInterface): Promise<ValidationInterface> {
    if (req.body.orderId === undefined || req.body.orderId.trim().length === 0) {
        return {
            hasError: true,
            error: error,
            type: ValidationType.OrderIdInBody,
        };
    }
    return returnTrue(ValidationType.OrderIdInBody);
}

async function invalidCategoriesListInBody(req: Request, error: ErrorInterface): Promise<ValidationInterface> {
    if (req.body.categories === undefined
        || !Array.isArray(req.body.categories)
        || Array.from(req.body.categories).length === 0) {
        return {
            hasError: true,
            error: error,
            type: ValidationType.CategoryListInBody,
        };
    }
    return returnTrue(ValidationType.CategoryListInBody);
}

async function invalidNameInParam(req: Request, error: ErrorInterface): Promise<ValidationInterface> {
    if (req.params.name === undefined || req.params.name.trim().length === 0) {
        return {
            hasError: true,
            error: error,
            type: ValidationType.NameInBody,
        };
    }
    return returnTrue(ValidationType.NameInBody);
}

async function invalidVideoInCacheFromParam(req: Request, error: ErrorInterface, video: ItemMediaInterface): Promise<ValidationInterface> {

    if (video === undefined || video === null) {
        return {
            hasError: true,
            error: error,
            type: ValidationType.ItemInCache,
        };
    }

    return returnTrueWithValue(video, ValidationType.ItemInCache);
}

async function invalidVideoIdInParams(req: Request, error: ErrorInterface): Promise<ValidationInterface> {
    if (req.params.videoId === undefined || req.params.videoId.trim().length === 0) {
        return {
            hasError: true,
            error: error,
            type: ValidationType.VideoIdInParam,
        };
    }
    return returnTrue(ValidationType.VideoIdInParam);
}

async function invalidAudioInCacheFromParam(req: Request, error: ErrorInterface, audio: ItemMediaInterface): Promise<ValidationInterface> {

    if (audio === undefined || audio === null) {
        return {
            hasError: true,
            error: error,
            type: ValidationType.ItemInCache,
        };
    }

    return returnTrueWithValue(audio, ValidationType.ItemInCache);
}


export {
    invalidUrlInParams,
    invalidEmailInBody,
    invalidUrlInBody,
    invalidNameInBody,
    invalidCategoriesListInBody,
    invalidNameInParam,
    invalidVideoInCacheFromParam,
    invalidIdInParams,
    invalidVideoIdInParams,
    invalidOrderIdInBody,
    invalidAudioInCacheFromParam,
}
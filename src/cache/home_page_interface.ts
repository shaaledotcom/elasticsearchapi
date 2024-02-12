import { ItemAuthor } from './item_detail_interface';
import { RoomSettingInterface } from './room_setting_interface';

export interface HomePageListInterface {
    callToActionLabel: string,
    callToActionUrl: string,
    id?: string,
    isCallToAction: boolean,
    name?: string,
    type?: string[],
    value?: string[],
    callToActionLocation: 'right' | 'left' | 'top' | 'bottom',
    thumbnailType: 'square' | 'circle' | 'normal' | 'large' | 'xLarge' | 'lCircle',
}

export interface HomePageInterface {
    slider: HomePageSliderData[];
    body: HomePageBodyInterface[];
    cursor?: { id: string, isSelected: boolean }[],
}

export interface HomePageSliderData {
    id?: string | null;
    buttonLink?: string | null;
    buttonText?: string | null;
    caption?: string | null;
    title?: string | null;
    image?: string | any;
    thumbnail?: { fileName: string, url: string };
    video?: string | null;
    index?: string;
}

export interface HomePageBodyInterface extends HomePageListInterface {
    title: string;
    id: string;
    data: HomePageBodyDataInterface[];
    data1: HomePageBodyDataInterface[];

}


export interface HomePageBodyDataInterface {
    id?: string;
    url?: string;
    type?: string; // event | course | video | playlist | audio | category | profile
    itemId?: string;
    title?: string;
    subTitle?: string;
    thumbnail?: string;
    listTags?: string[];
    sessionId?: string;
    isPremium?: boolean;
    status?: string;
    productName?: string;
    isVod?: boolean;
    accessType?: string;
    isSubscription?: boolean; // to check if item is under subscription
    // open class fields
    topic?: string,
    startDate?: Date,
    remainingString?: string,
    slot?: number,
    isLive?: boolean,
    name?: string,
    featuredTag?: string[],
    endDate?: Date,
    roomSettings?: RoomSettingInterface
    // new home page fields
    discount?: number,
    accessibility?: {
        code: string | null;
        isGiven: boolean;
    };
    profiles?: ItemAuthor[],
    priceUsd?: HomePagePrice,
    priceInr?: HomePagePrice,
    duration?: { hours: number, minutes: number, seconds: number },
    categories?: string[],
    price?: HomePagePrice,
    current?: { hour: number, minute: number, second: number };
    total?: { hour: number, minute: number, second: number };
}

export interface HomePagePrice {
    amount?: number,
    currency?: string,
    subUnit?: number,
    symbol?: string,
    discount?: number,
}
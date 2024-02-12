export interface EventDetailInterface {
    id: string;
    isGiveAccess?: boolean;
    artists: any[];
    organizations:EventOrgCat[];
    price?: {
        amount?: number,
        currency?: string,
        subUnit?: number,
        symbol?: string,
        discount?: number,
    } | null;
    thumbnail: EventImage | null | string;
    backgroundImage?: EventImage | null | string;
    description: string;
    accessibility?: {
        code: string | null;
        isGiven: boolean;
    };
    type: string;
    venue: string;
    endDateTime: Date;
    startDateTime: Date;
    eventPageEndTime: Date;
    eventUrl: string;
    status?: string;
    name: string;
    isArchive?: boolean;
    isCouponGenerationAvailable: boolean;
    isGeoBlocked?: boolean;
    isLive?: boolean;
    isPremium: boolean;
    isPrivate?: boolean;
    isVOD?: boolean;
    isVariablePricingAvailable: boolean;
    sessions?: EventSlotInfo[];
    category?: string;
    feeds?: EventFeedInterface[];
    trailer?: { embed: string, streamingUrl: string, hlsUrl: string } | any;
    isSubscriberDiscountAvailable?: boolean;
    isSubscribed?: boolean;
    isAddedToMylist?: boolean;
    sponsors?: Sponsor[],
    paymentGatewayKey?: string;
    sessionDetails?: EventVideoSession[] | [];
    premiumDetails?: EventPremiumDetail;
    geoBlockingDetails?: any;
    isSubscriptionEnabled?: boolean;
    enableHls?: boolean;
    sponsorsRaw?: { title?: string, value?: string[] }[],
    isUnlisted?: boolean,
    metaTags?: string[],
    categories?: string[],
}

export interface Sponsor {
    title?: string,
    value?: {
        id: string,
        url: string,
        name: string,
        thumbnail: string,
    }[],
}

export interface EventImage {
    storagePath?: string;
    url: string;
}

export interface EventOrgCat {
    name: string;
}

export interface EventSlotInfo {
    isArchive?: boolean;
    isLive?: boolean;
    isPremium?: boolean;
    endTime: Date;
    startTime: Date;
    thumbnail: string;
    title: string;
    id: string;
    status?: string;
}

export interface EventFeedInterface {
    caption?: string;
    date?: Date;
    images?: EventImage[] | string[] | null;
    videos?: EventImage[] | string[] | null;
    media?: EventFeedMedia[] | null;
}

export interface EventFeedMedia {
    type?: string | null;
    thumbnail?: string | null;
    streamingUrl?: string | null;
    embed?: string | null;
}

export interface EventVideoSession {
    category: EventOrgCat[];
    description: string;
    title: string;
    embed: string;
    endTime: Date;
    id: string;
    thumbnail: EventImage;
    streamingUrl: string;
    startTime: Date;
    isDownloadAvailable:boolean;
    status?:string;
    hlsUrl: string;
    isOpenClass?:boolean;
}

export interface EventPremiumDetail {
    giveAccess: string[];
    producerEmails: string[];
    price: EventPriceDetail;
    paymentGateway?: { dev: { key: string, secret: string }, prod: { key: string, secret: string }};
}

export interface EventPriceDetail {
    inr: number;
    usd: number;
    subscriberDiscount?:number;
}

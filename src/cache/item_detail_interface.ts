
export interface ItemDetailInterface {
    id?: string;
    title: string;
    subTitle?: string;
    url: string;
    thumbnail?: string;
    header?: string;
    trailer: { embed: string, url: string,hlsUrl:string } | any;
    level: string;
    updatedOn: Date;
    duration: { hours: number, minutes: number, seconds: number };
    description: string;
    language?: ItemLanguage[] | string;
    authors?: ItemAuthor[];
    courseIncludes: string | string[];
    chapters?: ItemChapterDetail[];
    feeds?: ItemFeedsDetail[];
    price?: ItemPrice;
    accessibility?: ItemAccessibility;
    review?: ItemReviewDetail;
    chapterMedia?: ItemChapterPlayListDetail;
    isPremium?:boolean;
    isSubscriberDiscountAvailable?:boolean;
    isSubscribed?:boolean;
    downloadableFiles?: any[];
    isAddedToMylist?:boolean;
    streamingCode?:string;
    metaTags?:string[],
    categories?: string[],
    priceUsd?: {
        amount?: number,
        currency?: string,
        subUnit?: number,
        symbol?: string,
        discount?: number,
    },
    priceInr?: {
        amount?: number,
        currency?: string,
        subUnit?: number,
        symbol?: string,
        discount?: number,
    },
}

export interface ItemPrice {
    amount: number;
    currency: 'INR' | 'USD' | string;
    symbol: string;
    subUnit: number;
    discount?:number,
}

export interface ItemAccessibility {
    code: string;
    isGiven: boolean;
}

export interface ItemAuthor {
    id: string;
    name: string;
    thumbnail: string;
    url?:string;
    type?:string;
    featuredTags?:string[];
}
export interface ItemLanguage {
    id:string;
    name: string;
}

export interface ItemChapterDetail {
    id: string;
    name: string;
    playList: ItemChapterPlayListDetail[];
}

export interface ItemChapterPlayListDetail {
    id: string;
    name: string;
    duration: { hours: number, minutes: number, seconds: number };
    thumbnail: string;
    type: 'audio' | 'video';
    access:string;
    embed?: string;
    streamingUrl?: string;
    updatedOn?: Date;
    hlsUrl?: string;
    itemId?:string,
    itemUrl?:string,
}

export interface ItemFeedsDetail {
    caption: string;
    date: Date;
    media: ItemFeedsMediaDetail[];
}

export interface ItemFeedsMediaDetail {
    id?: string;
    name?: string;
    thumbnail: string;
    type: 'image' | 'video';
    streamingUrl?: string;
    embed?: string;
}

export interface ItemReviewDetail {
    averageRating: number;
    ratingCount: Array<{ star: number, count: number }>;
    reviews?: ReviewDetail[];
    totalCount?:number;
}

export interface ReviewDetail {
    name?: string;
    review: string;
    stars: number;
    id?: string;
    userId?: string;
    updatedOn?: Date;
    createdOn?: Date;
    isVisible?: boolean;
}

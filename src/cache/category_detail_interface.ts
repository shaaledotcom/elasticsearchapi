export interface CategoryDetailInterface {
    slider: CategorySliderInterface;
    body: CategoryBodyInterface[];
    cursorId: string | null;
}

export interface CategorySliderInterface {
    id?: string | null;
    description?: string | null;
    title?: string | null;
    image?: string | null;
    video?: string | null;
    path?: CategoryViewInterface[];
    trailer?: { embed: string, streamingUrl: string } | any;
}

export interface CategoryBodyInterface {
    title: string;
    id: string;
    data: CategoryBodyDataInterface[];
    count?:number;
}

export interface CategoryBodyDataInterface {
    id?: string;
    url?: string;
    type?: string;
    itemId?: string;
    itemType?: string;
    title?: string;
    subTitle?: string;
    thumbnail: string;
    listTags?: string[];
    sessionId?: string;
    isPremium?: boolean;
    status?: string;
    productName?: string;
    isVod?: boolean;
    // open class fields
    topic?: string,
    startDate?: Date,
    remainingString?: string,
    slot?: number,
    isLive?: boolean,
    name?: string,
    featuredTag?: string[],
}

export interface CategoryViewInterface {
    id?: string;
    name?: string;
    level?: number;
    children?: CategoryViewInterface[];
    parentId?: string;
    isContentPresent?:boolean;
    hasAccess?:boolean;
    isVisible:boolean;
}


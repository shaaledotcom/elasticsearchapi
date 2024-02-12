import { ItemAuthor } from './item_detail_interface';

export interface ItemMediaInterface {
    thumbnail?: string;
    streamingUrl?: string;
    hlsUrl?: string;
    embed?: string;
    name?: string;
    title?: string;
    type?: 'video' | 'image' | 'audio' | 'course' | string;
    id?: string;
    url?: string;
    listTags?: string[];
    description?: string;
    accessibility?: {
        code: string | null;
        isGiven: boolean;
    };
    accessType?: string;
    isAddedToMylist?: boolean;
    isVisible?: boolean;
    streamingCode?: string;
    artistsRaw?: string[];
    metaTags?:{id:string,value:string}[],
    categories?: {id:string,value:string}[] | string[],
    profiles?: ItemAuthor[],
    isPremium?: boolean;
    docId?: string, // for my list
    current: { hour: number, minute: number, second: number };
    total: { hour: number, minute: number, second: number };
}

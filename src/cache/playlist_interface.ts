import { ItemAuthor } from './item_detail_interface';
import { ItemMediaInterface } from './item_media_interface';

export interface PlaylistInterface {
    title?: string;
    description?: string;
    thumbnail?: string;
    id?: string;
    type?: string;
    videoDetails?: ItemMediaInterface;
    playlist?: PlaylistItemInterface[];
    artists?: string[];
    categories?: string[];
    accessibility?: {
        code: string | null;
        isGiven: boolean;
    };
    streamingCode?: string;
    detailsList?: ItemMediaInterface[];
    metaTags?: string[],
    profiles?: ItemAuthor[],
}

export interface PlaylistItemInterface {
    title?: string;
    thumbnail?: string;
    id?: string;
    type?: string;
}

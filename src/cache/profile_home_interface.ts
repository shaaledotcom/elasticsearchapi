import {AwardDataInterface, AwardInterface} from './award_interface';
import {CategoryBodyInterface} from './category_detail_interface';
import {DiscipleInterface} from './disciple_interface';
import {ItemMediaInterface} from './item_media_interface';
import {MentorInterface} from './mentor_interface';
import {ScheduleInterface} from "./schedule_interface";

export interface ProfileHomeInterface {
    thumbnail?: string;
    backgroundImage?: string;
    id?: string;
    url?: string;
    title?: string;
    connect?: {
        phone: string;
        email: string;
        address?: {
            address?: string;
            city?: string;
            country?: string;
            pinCode?: string;
            placeId?: string;
            plusCode?: string | null;
            areaPlusCode?: string | null;
            location?: {
                lat: number;
                lng: number;
            };
            state?: string;
        } | null;
        website?: string
        socialLinks: Array<{
            type: 'facebook' | 'wikipedia' | 'instagram' | 'youtube' | 'linkedin' | string;
            url: string;
        }>;
        isEmailVisible?: boolean;
        isContactVisible?: boolean;
        isAddressVisible?: boolean;
    };
    gallery?: ItemMediaInterface[];
    content?: CategoryBodyInterface[];
    featuredTags?: { id: string, value: string }[];
    isStudioEnabled?: boolean;
    subProfileType?: { id: string, value: string }[];
    categories?: { id: string, value: string }[];
    about: string;
    awards?: AwardInterface;
    disciples?: DiscipleInterface;
    mentors?: MentorInterface;
    isProfileOwner?: boolean;
    status: string;
    profileType?: { id: string, value: string };
    openClass?: OpenClassHomeInterface;
    isLegacy?: boolean;
    dod?: Date
    dob?: Date
    isProfileTermsCheck?: boolean,
    collaborators?: MentorInterface,
    openTo?: AwardDataInterface[],
    schedule?: ScheduleInterface[],
    gender?: string;
}

export interface OpenClassHomeInterface {
    topic: string;
    startDate: Date;
    remainingString?: string;
    slot: number;
    isLive?: boolean;
}

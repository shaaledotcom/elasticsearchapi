export interface AwardDataInterface {
    id: string;
    year?: number;
    type?: string,
    value?: string;
    thumbnail?: string;
    isSelected?: boolean;
    isActive?:boolean;
    profileId?:string;
}

export interface AwardInterface {
    viewAll: boolean;
    count: number;
    data: AwardDataInterface[];
}

export interface AwardDbValueInterface {
    id: string,
    value: string,
    thumbnail?: { storagePath: string, url: string };
}
export interface AwardDbInterface {
    id: string,
    type: string,
    value: AwardDbValueInterface[]
}
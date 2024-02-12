export interface DiscipleMentorDataInterface {
    id: string;
    year?: number;
    value?: string;
    url?: string;
    thumbnail?: string;
    isSelected?: boolean;
    isActive?:boolean;
    profileId?:string;
}

export interface DiscipleInterface {
    viewAll: boolean;
    count: number;
    data: DiscipleMentorDataInterface[];
}

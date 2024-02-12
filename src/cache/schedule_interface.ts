export interface ScheduleInterface {
    id?: string;
    profileId: string;
    title: string,
    date: Date | string,
    venue?: string,
    link?: string,
    collaborators?: Array<string> & Array<ScheduleCollaboratorInterface>,
}

export interface ScheduleCollaboratorInterface {
    id: string;
    thumbnail?: string;
    value?: string;
    url?: string;
}

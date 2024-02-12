import { DiscipleMentorDataInterface } from './disciple_interface';

export interface MentorInterface {
    viewAll: boolean;
    count: number;
    data: DiscipleMentorDataInterface[];
}

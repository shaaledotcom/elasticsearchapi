import { DiscipleMentorDataInterface } from './disciple_interface';

export interface CollaboratorInterface {
    viewAll: boolean;
    count: number;
    data: DiscipleMentorDataInterface[];
}

import { Moment } from "moment";
import { IRecurrenceImage } from './IRecurrenceImage';
import { RecurrenceNextResult } from './RecurrenceNextResult';

export interface IRecurrence {
    readonly startDate: Moment;
    readonly image: IRecurrenceImage;

    next(): RecurrenceNextResult;
}


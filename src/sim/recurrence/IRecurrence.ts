import { Moment } from "moment";
import { IRecurrenceImage } from './IRecurrenceImage';

export interface IRecurrence<T extends IRecurrenceImage> extends Iterable<Moment> {
    readonly startDate: Moment;
    readonly image: IRecurrenceImage;
}


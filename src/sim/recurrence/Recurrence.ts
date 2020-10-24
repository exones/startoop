import { Moment } from "moment";
import { IRecurrence } from './IRecurrence';
import { IRecurrenceImage } from './IRecurrenceImage';

export abstract class Recurrence<T extends IRecurrenceImage> implements IRecurrence<T> {
    readonly startDate: Moment;
    readonly image: T;

    constructor(startDate: Moment, image: T) {
        this.startDate = startDate;
        this.image = image;
    }

    abstract [Symbol.iterator](): Iterator<Moment, any, undefined>;
}

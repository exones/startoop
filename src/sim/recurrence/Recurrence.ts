import { Moment } from "moment";
import { IRecurrence } from './IRecurrence';
import { IRecurrenceImage } from './IRecurrenceImage';
import { RecurrenceNextResult } from './RecurrenceNextResult';

export abstract class Recurrence<T extends IRecurrenceImage> implements IRecurrence {
    readonly startDate: Moment;
    readonly image: T;
    protected date?: Moment;
    protected done: boolean = false;

    constructor(startDate: Moment, image: T) {
        this.startDate = startDate;
        this.image = image;
        this.start();
    }

    protected abstract start(): void;
    abstract next(): RecurrenceNextResult;
}

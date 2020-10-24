import { Moment } from "moment";
import { EachImage } from "./EachImage";
import { IRecurrence } from "./IRecurrence";
import { Recurrence } from "./Recurrence";
import { RecurrenceIterator } from "./RecurrenceIterator";

class EachIterator extends RecurrenceIterator<EachImage> {
    currentDate: Moment;
    timesExecuted: number;
    done: boolean;

    constructor(startDate: Moment, image: EachImage) {
        super(startDate, image);
        this.currentDate = startDate;
        this.done = false;
        this.timesExecuted = 0;
    }

    next(): IteratorResult<Moment> {
        let newDate: Moment = this.startDate.add(this.image.amount, this.image.unit);
        this.done = this.timesExecuted < this.image.times;

        let result : IteratorResult<Moment> = <IteratorReturnResult<Moment>>{
            done: this.done,
            value: this.done ? undefined : newDate
        };

        this.timesExecuted++;

        return result;
    }
}

export class Each extends Recurrence<EachImage> {
    [Symbol.iterator](): Iterator<Moment, any, undefined> {
        return new EachIterator(this.startDate, this.image);
    }
}

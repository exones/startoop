import { Moment } from "moment";
import { IRecurrence } from './IRecurrence';
import { OnceImage } from './OnceImage';
import { Recurrence } from './Recurrence';

class OnceIterator implements Iterator<Moment> {
    readonly date: Moment;
    private done: boolean = false;

    constructor(date: Moment) {
        this.date = date;
    }
    next(): IteratorResult<Moment> {
        let result : IteratorResult<Moment> = <IteratorReturnResult<Moment>>{
            done: this.done,
            value: this.done ? undefined : this.date
        };
        this.done = true;

        return result;
    }
}

export class Once extends Recurrence<OnceImage> {
    [Symbol.iterator](): Iterator<Moment> {
        return new OnceIterator(this.startDate);
    }
}


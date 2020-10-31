import { Moment } from "moment";
import { isUndefined } from 'typescript-collections/dist/lib/util';
import { MomentUtils } from '../time/MomentUtils';
import { EachImage } from "./EachImage";
import { IRecurrence } from "./IRecurrence";
import { Recurrence } from "./Recurrence";
import { RecurrenceIterator } from "./RecurrenceIterator";
import { RecurrenceNextResult } from './RecurrenceNextResult';

class EachIterator extends RecurrenceIterator<EachImage> {
    currentDate: Moment;
    timesExecuted: number;
    private isDone: boolean;

    done(): void {
        this.isDone = true;
    }

    constructor(startDate: Moment, image: EachImage) {
        super(startDate, image);
        this.currentDate = startDate;
        this.isDone = false;
        this.timesExecuted = 0;
    }

    next(): IteratorResult<Moment> {
        let newDate: Moment = this.startDate.clone().add(this.image.period.amount, this.image.period.unit);

        let result : IteratorResult<Moment> = <IteratorReturnResult<Moment>>{
            done: this.isDone,
            value: this.isDone ? undefined : newDate
        };

        this.timesExecuted++;

        return result;
    }
}

export class Each extends Recurrence<EachImage> {
    private first: boolean = true;

    next(advance: boolean = true): RecurrenceNextResult {
        let newDate: Moment | undefined = undefined;
        if (this.first) {
            if (advance) {
                this.first = false;
            }
            newDate = this.startDate;
        } else {
            if (isUndefined(this.date)) {
                throw new Error("Current date is undefined.");
            }
            newDate = this.date.clone().add(this.image.period.amount, this.image.period.unit);
        }

        let result : RecurrenceNextResult = {
            done: this.done,
            date: this.done ? undefined : newDate
        };

        if (advance) {
            this.date = newDate;
        }

        return result;
    }
}

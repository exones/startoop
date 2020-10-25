import { Moment } from "moment";
import { MomentUtils } from '../time/MomentUtils';
import { IRecurrence } from './IRecurrence';
import { OnceImage } from './OnceImage';
import { Recurrence } from './Recurrence';
import { RecurrenceNextResult } from './RecurrenceNextResult';

export class Once extends Recurrence<OnceImage> {
    protected start(): void {
        this.date = MomentUtils.offsetToDate(this.image.at, this.startDate);
    }

    next(): RecurrenceNextResult {
        let result : RecurrenceNextResult = {
            done: this.done,
            date: this.done ? undefined : this.date
        };
        this.done = true;

        return result;
    }
}


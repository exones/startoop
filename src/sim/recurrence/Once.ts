import { Moment } from "moment";
import { MomentUtils } from "../time/MomentUtils";
import { IRecurrence } from "./IRecurrence";
import { OnceImage } from "./OnceImage";
import { Recurrence } from "./Recurrence";
import { RecurrenceNextResult } from "./RecurrenceNextResult";

export class Once extends Recurrence<OnceImage> {
    next(advance: boolean = false): RecurrenceNextResult {
        let result : RecurrenceNextResult = {
            done: this.done,
            date: this.done ? undefined : this.startDate
        };
        this.done = true;

        return result;
    }
}


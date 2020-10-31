import { Moment } from "moment";
import { IRecurrenceImage } from "./IRecurrenceImage";
import { RecurrenceNextResult } from "./RecurrenceNextResult";

export interface IRecurrence {
    readonly startDate: Moment;
    readonly image: IRecurrenceImage;


    next(advance: boolean): RecurrenceNextResult;
    getCurrent(): Moment | undefined;
}


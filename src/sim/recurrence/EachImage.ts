
import { Moment } from "moment";
import { MomentUtils } from '../time/MomentUtils';
import { Offset } from "../time/Offset";
import { OffsetInput } from "../time/OffsetInput";
import { isPeriod, Period } from "../time/Period";
import { Each } from "./Each";
import { IRecurrence } from "./IRecurrence";
import { IRecurrenceImage } from "./IRecurrenceImage";
import { RecurrenceImage } from "./RecurrenceImage";


export class EachImage implements RecurrenceImage<Each> {
    readonly period: Period;
    readonly at: OffsetInput;

    constructor(period: Period, at: OffsetInput) {
        this.period = period;
        this.at = at;
    }

    start(date: Moment): Each {
        const startDate = MomentUtils.offsetInputToDate(this.at, date);

        return new Each(startDate, this);
    }
}


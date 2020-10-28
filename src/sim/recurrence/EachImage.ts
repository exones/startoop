
import { Moment } from "moment";
import { Offset } from '../time/Offset';
import { OffsetInput } from '../time/OffsetInput';
import { Period } from "../time/Period";
import { Each } from "./Each";
import { IRecurrence } from "./IRecurrence";
import { IRecurrenceImage } from "./IRecurrenceImage";
import { RecurrenceImage } from './RecurrenceImage';


export class EachImage implements RecurrenceImage<Each> {
    readonly period: Period;
    readonly at: OffsetInput;

    constructor(period: Period, at: OffsetInput) {
        this.period = period;
        this.at = at;
    }

    start(date: Moment): Each {
        return new Each(date, this);
    }
}


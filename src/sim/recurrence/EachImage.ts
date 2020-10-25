
import { Moment } from "moment";
import { Offset } from '../time/Offset';
import { Period } from "../time/Period";
import { Each } from "./Each";
import { IRecurrence } from "./IRecurrence";
import { IRecurrenceImage } from "./IRecurrenceImage";
import { RecurrenceImage } from './RecurrenceImage';


export class EachImage implements RecurrenceImage<Each> {
    readonly period: Period;
    readonly at: Offset;

    constructor(period: Period, at: Offset) {
        this.period = period;
        this.at = at;
    }

    start(date: Moment): Each {
        return new Each(date, this);
    }
}


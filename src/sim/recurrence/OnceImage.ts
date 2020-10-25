import { Moment } from "moment";
import { Offset } from '../time/Offset';
import { IRecurrence } from './IRecurrence';
import { IRecurrenceImage } from "./IRecurrenceImage";
import { Once } from './Once';
import { RecurrenceImage } from './RecurrenceImage';


export class OnceImage implements RecurrenceImage<Once> {
    readonly at: Offset;

    constructor(at: Offset) {
        this.at = at;
    }

    start(date: Moment): Once {
        return new Once(date, this);
    }
}

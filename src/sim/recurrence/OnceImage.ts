import { Moment } from "moment";
import { Offset } from '../time/Offset';
import { OffsetInput } from '../time/OffsetInput';
import { IRecurrence } from './IRecurrence';
import { IRecurrenceImage } from "./IRecurrenceImage";
import { Once } from './Once';
import { RecurrenceImage } from './RecurrenceImage';


export class OnceImage implements RecurrenceImage<Once> {
    readonly at: OffsetInput;

    constructor(at: OffsetInput) {
        this.at = at;
    }

    start(date: Moment): Once {
        return new Once(date, this);
    }
}

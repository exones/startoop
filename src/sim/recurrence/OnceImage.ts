import { Moment } from "moment";
import { IRecurrence } from './IRecurrence';
import { IRecurrenceImage } from "./IRecurrenceImage";
import { Once } from './Once';


export class OnceImage implements IRecurrenceImage {
    start(date: Moment): Once {
        return new Once(date, this);
    }

}

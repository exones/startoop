import { Moment } from "moment";
import { IRecurrence } from "../recurrence/IRecurrence";
import { EventStreamImage } from "./EventStreamImage";

export class EventStream {
    readonly image: EventStreamImage;
    recurrence: IRecurrence;

    constructor(image: EventStreamImage, startDate: Moment) {
        this.image = image;
        this.recurrence = image.recurrence.start(startDate);
    }
}
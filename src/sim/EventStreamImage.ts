import { Moment } from "moment";
import { Event } from "./event/Event";
import { EventData } from "./event/EventData";
import { EachImageBuilder } from "./recurrence/EachImageBuilder";
import { IRecurrenceImage } from "./recurrence/IRecurrenceImage";
import { Recurrences } from "./recurrence/Recurrences";
import { SystemEntity } from "./SystemEntity";

export class EventStreamImage extends SystemEntity {
    recurrence: IRecurrenceImage = Recurrences.once();

    from(date: Moment | string): EventStreamImage {
        return this;
    }

    until(date: Moment | string): EventStreamImage {
        return this;
    }

    emit(emitter: () => EventData): EventStreamImage {
        return this;
    }

    once(): EventStreamImage {
        this.recurrence = Recurrences.once();

        return this;
    }

    each(amount: number): EachImageBuilder {
        return new EachImageBuilder(this, amount);
    }

    withRecurrence(recurrence: IRecurrenceImage): EventStreamImage {
        this.recurrence = recurrence;

        return this;
    }
}
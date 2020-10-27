import  moment, { MomentInput } from "moment";
import { isMoment, Moment, unitOfTime } from "moment";
import { EventData } from "./EventData";
import { EventEmitter } from "./EventEmitter";
import { IRecurrenceImage } from "../recurrence/IRecurrenceImage";
import { Recurrences } from "../recurrence/Recurrences";
import { SystemEntity } from "../SystemEntity";
import { Offset } from '../time/Offset';
import { MomentUtils } from '../time/MomentUtils';
import { isPeriod, Period } from "../time/Period";
import { isString } from "../util/StringUtils";

export class EventStreamImage extends SystemEntity {
    recurrence: IRecurrenceImage = Recurrences.once();
    startAt: Period | Moment = Period.of(0, "days");
    endAt: Period | Moment | undefined = undefined;
    emitter: EventEmitter<any> = () => { return <any>{}; };

    from(date: Offset): EventStreamImage {

        if (isPeriod(date)) {
            this.startAt = date;
        } else {
            this.startAt = MomentUtils.of(date);
        }

        return this;
    }

    until(date: Offset | undefined): EventStreamImage {
        if (date === undefined) {
            this.endAt = undefined;
        } else if (isPeriod(date)) {
            this.endAt = date;
        } else {
            this.endAt = MomentUtils.of(date);
        }

        return this;
    }

    emit<T extends EventData>(emitter: EventEmitter<T>): EventStreamImage {
        this.emitter = emitter;
        return this;
    }

    once(): EventStreamImage {
        this.recurrence = Recurrences.once();

        return this;
    }

    each(period: Period): EventStreamImage {
        this.recurrence = Recurrences.each(period);
        return this;
    }

    withRecurrence(recurrence: IRecurrenceImage): EventStreamImage {
        this.recurrence = recurrence;

        return this;
    }
}
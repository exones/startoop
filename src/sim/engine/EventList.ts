import { Moment } from "moment";
import { Queue } from "typescript-collections";
import { AnyEvent } from "../event/AnyEvent";


export class EventList {
    readonly events: Queue<AnyEvent>;
    readonly date: Moment;

    constructor(date: Moment) {
        this.date = date;
        this.events = new Queue<AnyEvent>();
    }

    enqueue(evt: AnyEvent): void {
        this.events.enqueue(evt);
    }

    dequeue(): AnyEvent | undefined {
        return this.events.dequeue();
    }

    peek(): AnyEvent | undefined {
        return this.events.peek();
    }

    size(): number {
        return this.events.size();
    }
}

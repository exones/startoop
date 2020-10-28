import { Moment } from "moment";
import { Dictionary,    PriorityQueue } from "typescript-collections";
import { isUndefined } from "typescript-collections/dist/lib/util";
import { Event } from "../event/Event";
import { AnyEvent } from "../event/AnyEvent";
import { MomentUtils } from "../time/MomentUtils";
import { newLogger } from "../log/LogRoot";
import { Logger } from "tslog";
import { EventList } from "./EventList";

export class Timeline {
    private readonly log: Logger = newLogger();
    readonly startDate: Moment;
    private readonly queue: PriorityQueue<EventList>;
    private readonly scheduledEvents: Dictionary<Moment, EventList>;
    private now: Moment;

    constructor(startDate: Moment) {
        this.startDate = startDate;
        this.queue = new PriorityQueue<EventList>((a, b) => {
            this.log.debug(`Matching ${a.date} and ${b.date}: ${a === b}, ${a.events.size() === b.events.size()}`);
            if (a.date.isSame(b.date)) {
                return 0;
            }
            if (a.date.isAfter(b.date)) {
                return -1;
            } else {
                return 1;
            }
        });

        this.scheduledEvents = new Dictionary<Moment, EventList>(m => MomentUtils.toIsoString(m));
        this.now = startDate;
    }

    getEventsForNow(): EventList {
        const res: EventList | undefined = this.scheduledEvents.getValue(this.now);

        if (isUndefined(res)) {
            return new EventList(this.now);
        }

        return res;
    }

    scheduleEvent(evt: AnyEvent): void {
        let eventsList = this.scheduledEvents.getValue(evt.date);

        if (isUndefined(eventsList)) { // no events for this date yet
            const newList: EventList = new EventList(evt.date);
            this.queue.enqueue(newList);
            newList.enqueue(evt);
            this.log.debug(`Enqueue ${newList.date}`);
            eventsList = newList;
        }

        eventsList.enqueue(evt); // add event to the end of the date's queue
    }

    hasFinished(): boolean {
        return this.queue.isEmpty();
    }

    getNow(): Moment {
        return this.now;
    }

    getNextEvent(): AnyEvent | undefined {
        const evList = this.queue.peek();

        // this.log.debug(`evList: ${JSON.stringify(evList)}`);
        if (isUndefined(evList)) { // empty queue: no events left
            return undefined;
        }

        const event = evList.dequeue();
        this.log.debug(`Dequeue event: ${event?.shortString()}`);
        // this.log.debug(`evList: ${JSON.stringify(evList)}`);

        if (isUndefined(event)) { // no events in the head element
            this.queue.dequeue(); // dequeue empty head element
            // this.log.debug(`New queue length: ${this.queue.size()}`);

            return this.getNextEvent();
        }

        if (event.date.isBefore(this.now)) {
            throw new Error(`Dequeued event was before current now (${MomentUtils.toIsoString(this.now)})`);
        }

        this.now = event.date;

        return event;
    }
}
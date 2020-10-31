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
    private endDate: Moment;

    constructor(startDate: Moment, endDate: Moment) {
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
        this.endDate = endDate;
    }

    getEventsForNow(): EventList {
        const res: EventList | undefined = this.scheduledEvents.getValue(this.now);
        const fromQueue: EventList | undefined = this.queue.peek();

        if (isUndefined(res)) { // no date defined
            return new EventList(this.now);
        } else {
            if (fromQueue !== res) {
                this.log.error(`From: ${fromQueue?.date} vs ${res?.date}.`)
                throw new Error("Mismatch from scheduledEvents and queue.");
            }
        }

        return res;
    }

    scheduleEvent(evt: AnyEvent): void {
        if (evt.date.isAfter(this.endDate)) { // we don't schedule events after simulation end
            return;
        }

        let eventsList : EventList | undefined = this.scheduledEvents.getValue(evt.date);

        if (isUndefined(eventsList)) { // no events for this date yet
            const newList: EventList = new EventList(evt.date);
            this.log.debug(`Enqueuing new date ${evt.date}`);
            this.queue.enqueue(newList);

            this.log.debug(`Now queue has size of ${this.queue.size()}.`);

            eventsList = newList;
        }

        this.log.debug(`Enqueuing new event ${evt.date}: ${evt}`);
        eventsList.enqueue(evt); // add event to the end of the date's queue
    }

    hasFinished(): boolean {
        return this.queue.isEmpty();
    }

    getNow(): Moment {
        return this.now;
    }

    advance(): boolean {
        const eventsForNow : EventList = this.getEventsForNow();

        if (eventsForNow.size() > 0) {
            throw new Error(`There are still some unprocessed events for ${this.now}.`);
        }

        this.queue.dequeue(); // remove current empty list
        const nextEventsList : EventList | undefined = this.queue.peek();

        if (isUndefined(nextEventsList)) {
            this.log.debug("Nowhere to advance: queue is empty.");
            return false; // queue finished
        }

        this.now = nextEventsList.date;
        this.log.debug(`Advanced to ${this.now}.`);

        return true;
    }

    getNextEvent(): AnyEvent | undefined {
        const evList = this.queue.peek();

        if (isUndefined(evList)) { // empty queue: no events left
            return undefined;
        }

        const event : AnyEvent | undefined = evList.dequeue();

        if (isUndefined(event)) { // no events in the head element
            this.queue.dequeue(); // dequeue empty head element

            return this.getNextEvent();
        }

        if (event.date.isBefore(this.now)) {
            throw new Error(`Dequeued event was before current now (${MomentUtils.toIsoString(this.now)})`);
        }

        this.now = event.date;

        return event;
    }
}
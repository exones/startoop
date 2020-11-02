import { Moment } from "moment";
import { Dictionary,    PriorityQueue } from "typescript-collections";
import { isUndefined } from "typescript-collections/dist/lib/util";
import { Event } from "../event/Event";
import { AnyEvent } from "../event/AnyEvent";
import { MomentUtils } from "../time/MomentUtils";
import { newLogger } from "../log/LogRoot";
import { Logger } from "@/sim/log/Logger";
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
        // const res: EventList | undefined = this.scheduledEvents.getValue(this.now);
        const fromQueue: EventList | undefined = this.queue.peek();

        if (isUndefined(fromQueue)) { // no date defined
            this.log.warn("No date defined.")
            return new EventList(this.now);
        }

        return fromQueue;
    }

    scheduleEvent(evt: AnyEvent): void {
        if (evt.date.isAfter(this.endDate)) { // we don't schedule events after simulation end
            this.log.debug(`Discarding event '${evt.name}' at ${MomentUtils.toIsoString(evt.date)} is it's after end date (${MomentUtils.toIsoString(this.endDate)}).`);
            return;
        }

        let eventsList : EventList | undefined = this.scheduledEvents.getValue(evt.date);

        if (isUndefined(eventsList)) { // no events for this date yet
            const newList: EventList = new EventList(evt.date);
            this.log.debug(`Enqueuing new date ${evt.date}`);
            this.queue.enqueue(newList);

            this.log.debug(`Now queue has size of ${this.queue.size()}, queue peek: ${this.queue.peek()?.size()} (${this.queue.peek()?.date}).`);

            eventsList = newList;
            this.scheduledEvents.setValue(evt.date, eventsList);
        }

        this.log.debug(`Enqueuing new event ${evt.date}: ${evt}`);
        eventsList.enqueue(evt); // add event to the end of the date's queue
        this.log.debug(`Now queue has size of ${this.queue.size()}, queue peek: ${this.queue.peek()?.size()} (${this.queue.peek()?.date}) [${this.queue.peek()?.peek()}].`);
    }

    hasFinished(): boolean {
        return this.queue.isEmpty();
    }

    getNow(): Moment {
        return this.now;
    }

    start(): void {
        const firstEvent: EventList | undefined = this.queue.peek();
        if (isUndefined(firstEvent)){
            this.now = this.startDate;
        } else {
            this.now = firstEvent.date;
        }
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
        this.log.debug(`Advanced to ${this.now}: ${nextEventsList.size()} events.`);

        return true;
    }
}
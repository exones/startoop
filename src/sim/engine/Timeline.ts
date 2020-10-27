import { Moment } from 'moment';
import { Dictionary,    PriorityQueue, Queue } from 'typescript-collections';
import { isUndefined } from 'typescript-collections/dist/lib/util';
import { Event } from '../event/Event';
import { AnyEvent } from "../event/AnyEvent";
import { MomentUtils } from '../time/MomentUtils';
import { newLogger } from '../log/LogRoot';
import { Logger } from 'tslog';

class EventList {
    private readonly events : Queue<AnyEvent>;
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
}

export class Timeline {
    private readonly log: Logger = newLogger();
    readonly startDate: Moment;
    private readonly queue: PriorityQueue<EventList>;
    private readonly scheduledEvents: Dictionary<Moment, EventList>;
    private now: Moment;

    constructor(startDate: Moment) {
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

        this.scheduledEvents = new Dictionary<Moment, EventList>(m => MomentUtils.toIsoDate(m));
        this.now = startDate;
    }

    scheduleEvent(evt: Event<any>): void {
        let eventsList = this.scheduledEvents.getValue(evt.date);

        this.log.debug(`Schedule ${evt.shortString()}`);

        if (isUndefined(eventsList)) {
            let newList: EventList = new EventList(evt.date);
            this.scheduledEvents.setValue(evt.date, newList);
            this.queue.enqueue(newList);
            this.log.debug(`Enqueue ${newList.date}`);
            // this.queue.forEach((l) => { this.log.debug(`${l.date}`); });
            this.log.debug(`${JSON.stringify(this.queue)}`);
            eventsList = newList;
        }
        eventsList.enqueue(evt);
    }

    getNextEvent(): AnyEvent | undefined {
        
        const evList = this.queue.peek();

        this.log.debug(`evList: ${JSON.stringify(evList)}`);
        if (isUndefined(evList)) { // empty queue: no events left
            return undefined;
        }

        const event = evList.dequeue();
        this.log.debug(`Dequeue event: ${event?.shortString()}`);
        this.log.debug(`evList: ${JSON.stringify(evList)}`);

        if (isUndefined(event)) { // no events in the head element
            this.queue.dequeue(); // dequeue empty head element
            this.log.debug(`New queue length: ${this.queue.size()}`);

            return this.getNextEvent();
        }

        if (event.date.isBefore(this.now)) {
            throw new Error(`Dequeued event was before current now (${MomentUtils.toIsoDate(this.now)})`);
        }

        this.now = event.date;

        return event;
    }
}
import { EventList } from "@/sim/engine/EventList";
import { Event } from '@/sim/event/Event';
import { Events } from '@/sim/event/Events';
import { MomentUtils } from '@/sim/time/MomentUtils';
import { Moment } from 'moment';
import { PriorityQueue, Queue } from "typescript-collections";
import { isUndefined } from 'typescript-collections/dist/lib/util';

interface Tup{
    key: Moment;
    value: Queue<string>;
}

describe("smth", () => {
    it("must",  () => {
        const pq = new PriorityQueue<EventList>((a, b) => {
            if (a.date.isSame(b.date)) {
                return 0;
            }
            if (a.date.isAfter(b.date)) {
                return -1;
            } else {
                return 1;
            }
        });


        const a = new EventList(MomentUtils.of("2020-01-09"));
        const b = new EventList(MomentUtils.of("2020-01-07"));
        const c = new EventList(MomentUtils.of("2020-01-01"));
        const d = new EventList(MomentUtils.of("2020-01-02"));

        a.enqueue(new Event(a.date, Events.spend(9)()));
        b.enqueue(new Event(b.date, Events.spend(7)()));
        c.enqueue(new Event(c.date, Events.spend(1)()));
        d.enqueue(new Event(d.date, Events.spend(2)()));


        pq.enqueue(a);
        pq.enqueue(b);
        pq.enqueue(c);
        pq.enqueue(d);

        let res: EventList | undefined = undefined;

        do {
            res = pq.dequeue();
            console.log(res?.dequeue());
        }while (!isUndefined(res));
        
    });
});
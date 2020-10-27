import { MomentUtils } from '@/sim/time/MomentUtils';
import { Moment } from 'moment';
import { PriorityQueue } from "typescript-collections";
import { isUndefined } from 'typescript-collections/dist/lib/util';

interface Tup{
    key: Moment;
    value: string;
}

describe("smth", () => {
    it("must",  () => {
        const pq = new PriorityQueue<Tup>((a, b) => {
            if (a.key.isSame(b.key)) {
                return 0;
            }
            if (a.key.isAfter(b.key)) {
                return -1;
            } else {
                return 1;
            }
        });

        pq.enqueue({ key: MomentUtils.of("2020-01-09"), value: "Maden" });
        pq.enqueue({ key: MomentUtils.of("2020-01-07"), value: "John" });
        pq.enqueue({ key: MomentUtils.of("2020-01-01"), value: "Sally" });
        pq.enqueue({ key: MomentUtils.of("2020-01-02"), value: "MoreJohn" });

        let res: Tup | undefined = undefined;

        do {
            res = pq.dequeue();
            console.log(res);
        }while (!isUndefined(res));
        
    });
});
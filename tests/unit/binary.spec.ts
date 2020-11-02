import { MomentUtils } from '@/sim/time/MomentUtils';
import { binarySearch } from "@/sim/util/BinarySearch";
import { Moment } from 'moment';

describe("binarySearch", () => {
    const numberComparator: (elem: number) => ((x: number) => number) = (elem: number) => (x: number) => {
        if (x === elem) {
            return 0;
        }

        if (x < elem) {
            return 1;
        }
        return -1;
    }

    const dateComparator: (elem: Moment) => (x: Moment) => number = elem => x => {
        if (x.isSame(elem)) {
            return 0;
        }

        if (x.isBefore(elem)) {
            return 1;
        }
        return -1;
    }

    it("32", () => {
        const arr = [1, 3, 8, 14, 30, 60];

        const elem = 32;
        const res = binarySearch(arr, numberComparator(elem));

        expect(res).toBe(4);
    });

    it("14", () => {
        const arr = [1, 3, 8, 14, 30, 60];

        const elem = 14;
        const res = binarySearch(arr, numberComparator(elem));

        expect(res).toBe(3);
    });

    it("2", () => {
        const arr = [1, 3, 8, 14, 30, 60];

        const elem = 2;
        const res = binarySearch(arr, numberComparator(elem));

        expect(res).toBe(0);
    });

    it("61", () => {
        const arr = [1, 3, 8, 14, 30, 60];

        const elem = 5;
        const res = binarySearch(arr, numberComparator(elem));

        expect(res).toBe(0);
    });

    it("0", () => {
        const arr = [1, 3, 8, 14, 30, 60];

        const elem = 0;
        const res = binarySearch(arr, numberComparator(elem));

        expect(res).toBe(-1);
    });

    it("2020-01-01", () => {
        const arr = [ MomentUtils.of("2020-01-01"), MomentUtils.of("2020-03-01"), MomentUtils.of("2020-05-01") ];

        const elem = MomentUtils.of("2020-01-01");
        const res = binarySearch(arr, dateComparator(elem));

        expect(res).toBe(0);
    });

    it("2020-02-01", () => {
        const arr = [ MomentUtils.of("2020-01-01"), MomentUtils.of("2020-03-01"), MomentUtils.of("2020-05-01") ];

        const elem = MomentUtils.of("2020-01-01");
        const res = binarySearch(arr, dateComparator(elem));

        expect(res).toBe(0);
    });

    it("2020-03-01", () => {
        const arr = [ MomentUtils.of("2020-01-01"), MomentUtils.of("2020-03-01"), MomentUtils.of("2020-05-01") ];

        const elem = MomentUtils.of("2020-03-01");
        const res = binarySearch(arr, dateComparator(elem));

        expect(res).toBe(1);
    });

    it("2020-03-02", () => {
        const arr = [ MomentUtils.of("2020-01-01"), MomentUtils.of("2020-03-01"), MomentUtils.of("2020-05-01") ];

        const elem = MomentUtils.of("2020-03-02");
        const res = binarySearch(arr, dateComparator(elem));

        expect(res).toBe(1);
    });

    it("2020-05-01", () => {
        const arr = [ MomentUtils.of("2020-01-01"), MomentUtils.of("2020-03-01"), MomentUtils.of("2020-05-01") ];

        const elem = MomentUtils.of("2020-05-01");
        const res = binarySearch(arr, dateComparator(elem));

        expect(res).toBe(2);
    });

    it("2020-05-10", () => {
        const arr = [ MomentUtils.of("2020-01-01"), MomentUtils.of("2020-03-01"), MomentUtils.of("2020-05-01") ];

        const elem = MomentUtils.of("2020-05-10");
        const res = binarySearch(arr, dateComparator(elem));

        expect(res).toBe(2);
    });
});
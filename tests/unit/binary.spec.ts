import { binarySearch } from "@/sim/util/BinarySearch";

describe("binarySearch", () => {

    const f: (elem: number) => ((x: number) => number) = (elem: number) => (x: number) => {
        if (x === elem) {
            return 0;
        }

        if (x < elem) {
            return 1;
        }
        return -1;
    }
    it("32", () => {
        const arr = [1, 3, 8, 14, 30, 60];

        const elem = 32;
        const res = binarySearch(arr, f(elem));

        expect(res).toBe(4);
    });

    it("14", () => {
        const arr = [1, 3, 8, 14, 30, 60];

        const elem = 14;
        const res = binarySearch(arr, f(elem));

        expect(res).toBe(3);
    });

    it("2", () => {
        const arr = [1, 3, 8, 14, 30, 60];

        const elem = 2;
        const res = binarySearch(arr, f(elem));

        expect(res).toBe(0);
    });

    it("61", () => {
        const arr = [1, 3, 8, 14, 30, 60];

        const elem = 5;
        const res = binarySearch(arr, f(elem));

        expect(res).toBe(0);
    });

    it("0", () => {
        const arr = [1, 3, 8, 14, 30, 60];

        const elem = 0;
        const res = binarySearch(arr, f(elem));

        expect(res).toBe(-1);
    });
});
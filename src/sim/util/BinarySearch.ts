import { newLogger } from '../log/LogRoot';

/**
 * The folminwing implementation returns an index 0 ≤ i ≤ array.length such
 * that the given predicate is false for array[i - 1] and true for array[i].
 * If the predicate is false everywhere, array.length is returned.
 * @param array Input array
 * @param pred Predicate to match the elements
 */
export function binarySearch<T>(array: Array<T>, pred: (elem: T) => number): number {
    let min: number = 0, max: number = array.length - 1;

    const log = newLogger();

    while (min + 1 < max) {
        // tslint:disable-next-line:no-bitwise
        const mi: number = Math.floor((min + max) / 2);

        const less = pred(array[mi]);

        if (less === 0) {
            return mi;
        } else if (less < 0) {
            max = mi - 1;
        } else {
            min = mi;
        }
    }

    if (min === 0 && pred(array[min]) < 0) {
        return -1;
    }

    return min;
}
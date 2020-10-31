/**
 * The following implementation returns an index 0 ≤ i ≤ array.length such
 * that the given predicate is false for array[i - 1] and true for array[i].
 * If the predicate is false everywhere, array.length is returned.
 * @param array Input array
 * @param pred Predicate to match the elements
 */
export function binarySearch<T>(array: Array<T>, pred: (elem: T) => boolean): number {
    let lo: number = -1, hi: number = array.length;

    while (1 + lo < hi) {
        // tslint:disable-next-line:no-bitwise
        const mi: number = lo + ((hi - lo) >> 1);
        if (pred(array[mi])) {
            hi = mi;
        } else {
            lo = mi;
        }
    }
    return hi;
}
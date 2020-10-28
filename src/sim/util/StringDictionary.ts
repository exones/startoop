import { Dictionary } from "typescript-collections";

export class StringDictionary<T> extends Dictionary<string, T> {
    constructor() {
        super();
    }
}
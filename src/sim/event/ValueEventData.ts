import { EventData } from './EventData';


export class ValueEventData<T> extends EventData {
    readonly value: T;

    constructor(name: string, value: T) {
        super(name);
        this.value = value;
    }

    shortString(): string {
        return `${this.value}`;
    }
}

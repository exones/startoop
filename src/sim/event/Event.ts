import { Moment } from "moment";
import { SystemEntity } from "../SystemEntity";
import { EventData } from "./EventData";

export class Event<TData extends EventData> extends SystemEntity {
    readonly date: Moment;
    readonly data: TData;

    constructor(date: Moment, data: TData) {
        super(data.name);
        this.date = date.startOf("day");
        this.data = data;
    }

    dateString(): string {
        return this.date.format("YYYY-MM-DD");
    }

    shortString(): string {
        return "${data.shortString()} at ${this.dateString()}";
    }
}

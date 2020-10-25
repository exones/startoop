import { Moment } from "moment";

export interface RecurrenceNextResult {
    date: Moment | undefined;
    done: boolean;
}
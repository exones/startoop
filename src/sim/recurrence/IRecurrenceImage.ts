import { Moment } from "moment";
import { IRecurrence } from "./IRecurrence";

export interface IRecurrenceImage {
    start(date: Moment): IRecurrence<any>;
}
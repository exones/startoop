import { Moment } from "moment";
import { IRecurrence } from "./IRecurrence";

export interface IRecurrenceImage {
    start(worldStart: Moment): IRecurrence;
}
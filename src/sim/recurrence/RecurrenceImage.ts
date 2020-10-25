import { Moment } from 'moment';
import { IRecurrence } from './IRecurrence';
import { IRecurrenceImage } from './IRecurrenceImage';

export abstract class RecurrenceImage<T extends IRecurrence> implements IRecurrenceImage {
    abstract start(date: Moment): T;
}
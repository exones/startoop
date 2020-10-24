
import { Moment } from 'moment';
import { Each } from './Each';
import { IRecurrence } from './IRecurrence';
import { IRecurrenceImage } from './IRecurrenceImage';


export class EachImage implements IRecurrenceImage {
    readonly amount: number;
    readonly unit: moment.unitOfTime.Base;
    readonly times: number;

    constructor(amount: number, unit: moment.unitOfTime.Base, times: number = -1) {
        this.amount = amount;
        this.unit = unit;
        this.times = times;
    }

    start(date: Moment): Each {
        return new Each(date, this);
    }
}


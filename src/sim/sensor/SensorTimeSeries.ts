import { Moment } from 'moment';

export class SensorTimeSeries<TData> {
    readonly startDate: Moment;

    constructor(startDate: Moment) {
        this.startDate = startDate;
    }
}

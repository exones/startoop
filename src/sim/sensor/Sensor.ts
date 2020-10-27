import { Moment } from 'moment';
import { SystemEntity } from '../SystemEntity';
import { SensorImage } from './SensorImage';
import { SensorTimeSeries } from './SensorTimeSeries';

export class Sensor<TData> extends SystemEntity {
    readonly image: SensorImage<TData>;
    readonly startDate: Moment;
    readonly timeSeries: SensorTimeSeries<TData>;

    constructor(image: SensorImage<TData>, startDate: Moment) {
        super(image.name);

        this.image = image;
        this.startDate = startDate;

        this.timeSeries = new SensorTimeSeries<TData>(startDate);
    }
}
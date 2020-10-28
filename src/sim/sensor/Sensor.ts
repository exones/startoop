import { Moment } from 'moment';
import { Logger } from 'tslog';
import { isUndefined } from 'typescript-collections/dist/lib/util';
import { AnyEvent } from '../event/AnyEvent';
import { newLogger } from '../log/LogRoot';
import { SystemImage } from '../System';
import { SystemEntity } from '../SystemEntity';
import { SensorImage } from './SensorImage';
import { SensorTimeSeries } from './SensorTimeSeries';

export class Sensor<TData> extends SystemEntity {
    private readonly log: Logger = newLogger();
    readonly image: SensorImage<TData>;
    readonly startDate: Moment;
    readonly timeSeries: SensorTimeSeries<TData>;

    constructor(image: SensorImage<TData>, startDate: Moment) {
        super(image.name);

        this.image = image;
        this.startDate = startDate;

        const initialData = this.image.initalizer();
        this.timeSeries = new SensorTimeSeries<TData>(startDate, initialData);
    }

    react(sys: SystemImage, evt: AnyEvent): TData | undefined {
        const oldData = this.timeSeries.dataAt(evt.date);
        const newData = this.image.reactions.getValue(evt.name)?.(sys, evt, oldData);

        if (isUndefined(newData)) { // no reaction for this event
            this.log.warn(`Sensor ${this.name} doesn't have reaction for ${evt.name}.`);
        }

        return newData;
    }
}
import { Moment } from "moment";
import { isUndefined } from 'typescript-collections/dist/lib/util';
import { MomentDictionary } from "../time/MomentDictionary";

export class SensorTimeSeries<TData> {
    readonly startDate: Moment;
    readonly data: MomentDictionary<TData> = new MomentDictionary<TData>();
    readonly initialData: TData;

    constructor(startDate: Moment, initialData: TData) {
        this.startDate = startDate;
        this.initialData = initialData;
    }

    dataAt(date: Moment): TData {
        const datum = this.data.getValue(date);

        if (isUndefined(datum)) {
            return this.initialData;
        }

        return datum;
    }
}

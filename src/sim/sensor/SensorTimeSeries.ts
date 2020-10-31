import { Moment } from "moment";
import { isUndefined } from "typescript-collections/dist/lib/util";
import { MomentDictionary } from "../time/MomentDictionary";
import { MomentUtils } from "../time/MomentUtils";
import { binarySearch } from "../util/BinarySearch";

export class SensorTimeSeries<TData> {
    readonly startDate: Moment;
    readonly data: MomentDictionary<TData> = new MomentDictionary<TData>();
    readonly initialData: TData;
    private lastDate: Moment;
    private dates: Array<Moment>;

    constructor(startDate: Moment, initialData: TData) {
        this.startDate = startDate;
        this.initialData = initialData;
        this.lastDate = startDate.clone().subtract(1, "day");
        this.dates = [];
    }

    dataAt(date: Moment): TData {
        const datum = this.data.getValue(date);

        if (date.isBefore(this.startDate)) {
            throw new Error("Can't get sensor data before the start date.");
        }

        if (this.dates.length === 0) {
            return this.initialData;
        }

        if (isUndefined(datum)) {
            let index: number = binarySearch(this.dates, x => x.isSame(date));

            if (index >= this.dates.length) { // now date found
                index = this.dates.length - 1;
            }
            const res = this.data.getValue(this.dates[index]);

            if (isUndefined(res)) {
                throw new Error("Impossible not to have data at this point.");
            }

            return res;
        }

        return datum;
    }

    setData(date: Moment, data: TData): void {
        if (date.isBefore(this.lastDate)) {
            throw new Error(`Trying to set the sensor data on ${MomentUtils.toIsoString(date)} before the latest known date ${MomentUtils.toIsoString(this.lastDate)}.`);
        }

        this.data.setValue(date, data);
        this.lastDate = date;
        this.dates.push(date);
    }
}

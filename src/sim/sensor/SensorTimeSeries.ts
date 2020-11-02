import { Moment } from "moment";
import { Logger } from "@/sim/log/Logger";
import { isUndefined } from "typescript-collections/dist/lib/util";
import { newLogger } from "../log/LogRoot";
import { MomentDictionary } from "../time/MomentDictionary";
import { MomentUtils } from "../time/MomentUtils";
import { binarySearch } from "../util/BinarySearch";

export enum SensorStyle {
    Impulse,
    Cumulative
}

export class SensorTimeSeries<TData> {
    private readonly log: Logger = newLogger();
    readonly startDate: Moment;
    readonly data: MomentDictionary<TData> = new MomentDictionary<TData>();
    readonly initialData: TData;
    private lastDate: Moment;
    private dates: Array<Moment>;
    private style: SensorStyle;

    constructor(startDate: Moment, initialData: TData, style: SensorStyle) {
        this.startDate = startDate;
        this.initialData = initialData;
        this.lastDate = startDate.clone().subtract(1, "day");
        this.dates = [];
        this.style = style;
    }

    getDates(): Array<Moment> {
        return this.dates;
    }

    private readonly binarySearchComparator: (date: Moment) => (x: Moment) => number = date => x => {
        if (x.isSame(date)) {
            return 0;
        }

        if (x.isBefore(date)) {
            return 1;
        }

        return -1;
    }

    dataAt(date: Moment): TData {
        if (date.isBefore(this.startDate)) {
            throw new Error("Can't get sensor data before the start date.");
        }

        if (this.dates.length === 0) {
            this.log.debug(`No dates, so taking initial data ${JSON.stringify(this.initialData)}`);
            return this.initialData;
        }

        const datum: TData | undefined = this.data.getValue(date);

        if (!isUndefined(datum)) {
            this.log.debug(`Event taken from exact date ${date}: ${JSON.stringify(datum)}`);
            return datum;
        }
        switch (this.style) {
            case SensorStyle.Impulse:
                return this.initialData;

            case SensorStyle.Cumulative: {
                const index: number = binarySearch(this.dates, this.binarySearchComparator(date));


                if (index < 0) {
                    throw new Error(`Date before beginning: ${MomentUtils.toIsoString(date)}, ${JSON.stringify(this.dates)}`);
                }

                const res: TData | undefined = this.data.getValue(this.dates[index]);

                this.log.debug(`Event taken from date from BS (index: ${index}, date: ${this.dates[index]}: ${JSON.stringify(res)}`);

                if (isUndefined(res)) {
                    throw new Error(`Impossible not to have data at this point (index ${index})`);
                }

                return res;
            }
        }
    }

    setData(date: Moment, data: TData): void {
        if (date.isBefore(this.lastDate)) {
            throw new Error(`Trying to set the sensor data on ${MomentUtils.toIsoString(date)} before the latest known date ${MomentUtils.toIsoString(this.lastDate)}.`);
        }

        if (isUndefined(this.data.getValue(date))) {
            this.dates.push(date);
            this.log.debug(`Now dates are: ${JSON.stringify(this.dates)}`);
        }
        this.data.setValue(date, data);
        this.lastDate = date;
    }
}

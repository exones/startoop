import { Moment } from "moment";

export class SimulationResult {
    readonly dates: Array<Moment>;
    readonly data: Array<Array<number>>;
    readonly sensorNames: Array<string>;

    constructor(sensorNames: Array<string>, dates: Array<Moment>, data: Array<Array<number>>) {
        this.sensorNames = sensorNames;
        this.dates = dates;
        this.data = data;
    }
}
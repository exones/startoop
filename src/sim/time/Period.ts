import { Moment } from "moment";
import "@/sim/time/PeriodExtensions";

export class Period {
    static readonly ZERO = (0).days();

    readonly amount: number;
    readonly unit: moment.unitOfTime.Base;

    static of(amount: number, unit: moment.unitOfTime.Base): Period {
        return new Period(amount, unit);
    }

    constructor(amount: number, unit: moment.unitOfTime.Base) {
        this.amount = amount;
        this.unit = unit;
    }

    from(moment: Moment): Moment {
        return moment.add(this.amount, this.unit);
    }
}

export function isPeriod(obj: any): obj is Period {
    return obj instanceof Period;
}


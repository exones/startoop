import { Period } from "./Period";

declare global {
    export interface Number {
        days(): Period;
        day(): Period;
        month(): Period;
        months(): Period;
        year(): Period;
        years(): Period;
    }
}

Number.prototype.days = function(this: number): Period {
    return Period.of(this, "days");
};

Number.prototype.day = function(this: number): Period {
    return Period.of(this, "day");
};

Number.prototype.months = function(this: number): Period {
    return Period.of(this, "months");
};

Number.prototype.month = function(this: number): Period {
    return Period.of(this, "month");
};

Number.prototype.years = function(this: number): Period {
    return Period.of(this, "years");
};

Number.prototype.year = function(this: number): Period {
    return Period.of(this, "year");
};

export {};
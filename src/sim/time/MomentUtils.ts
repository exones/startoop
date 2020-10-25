import moment, { Moment, MomentInput } from "moment";
import { Offset } from "./Offset";
import { isPeriod } from "./Period";

export class MomentUtils {

    static readonly ISO_FORMAT = "YYYY-MM-DD";

    static of(inp: MomentInput): Moment {
        return moment(inp, MomentUtils.ISO_FORMAT, true).startOf("day");
    }

    static toIsoDate(moment: Moment): string {
        return moment.format(MomentUtils.ISO_FORMAT);
    }

    static now(): Moment {
        return moment(moment.now());
    }

    static offsetToDate(offset: Offset, startDate: Moment): Moment {
        if (isPeriod(offset)) {
            return offset.from(startDate);
        } else {
            return <Moment>offset;
        }
    }
}
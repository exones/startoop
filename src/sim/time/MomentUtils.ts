import moment, { Moment, MomentInput } from "moment";
import { Offset } from "./Offset";
import { OffsetInput } from './OffsetInput';
import { isPeriod } from "./Period";

export class MomentUtils {

    static readonly ISO_FORMAT = "YYYY-MM-DD";

    static of(inp: MomentInput): Moment {
        return moment.utc(inp, MomentUtils.ISO_FORMAT, true).startOf("day");
    }

    static toIsoString(moment: Moment): string {
        return moment.format(MomentUtils.ISO_FORMAT);
    }

    static now(): Moment {
        return moment(moment.now());
    }

    static offsetInputToDate(offset: OffsetInput, startDate: Moment): Moment {
        if (isPeriod(offset)) {
            return offset.from(startDate);
        }
        return MomentUtils.of(offset);
    }

    static offsetToDate(offset: Offset, startDate: Moment): Moment {
        if (isPeriod(offset)) {
            return offset.from(startDate);
        }
        return offset;
    }
}
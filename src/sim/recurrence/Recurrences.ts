import { Offset } from '../time/Offset';
import { Period } from '../time/Period';
import { EachImage } from './EachImage';
import { OnceImage } from "./OnceImage";

export class Recurrences {
    private static readonly ONCE = new OnceImage(Period.of(0, "days"));

    static once(): OnceImage {
        return Recurrences.ONCE;
    }

    static each(period: Period, at: Offset = Period.ZERO): EachImage {
        return new EachImage(period, at);
    }
}

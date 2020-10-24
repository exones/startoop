import { EachImage } from './EachImage';
import { EachImageBuilder } from './EachImageBuilder';
import { OnceImage } from "./OnceImage";

export class Recurrences {
    private static readonly ONCE = new OnceImage();

    static once(): OnceImage {
        return Recurrences.ONCE;
    }

    static each(amount: number, unit: moment.unitOfTime.Base): EachImage {
        return new EachImage(amount, unit);
    }
}

import { Moment } from 'moment';
import { IRecurrenceImage } from './IRecurrenceImage';

export abstract class RecurrenceIterator<TImage extends IRecurrenceImage> implements Iterator<Moment> {
    readonly image: TImage;
    readonly startDate: Moment;

    constructor(startDate: Moment, image: TImage) {
        this.startDate = startDate;
        this.image = image;
    }

    abstract next(): IteratorResult<Moment>;
}
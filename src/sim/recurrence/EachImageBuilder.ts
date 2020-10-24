import { Moment } from 'moment';
import { EventStreamImage } from '../EventStreamImage';
import { Recurrences } from './Recurrences';

export class EachImageBuilder {
    readonly amount: number;
    private readonly parent: EventStreamImage;

    constructor(parent: EventStreamImage, amount: number) {
        this.amount = amount;
        this.parent = parent;
    }

    day(): EventStreamImage {
        return this.parent.withRecurrence(Recurrences.each(this.amount, "days"));
    }
}
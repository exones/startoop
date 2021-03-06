import { Moment } from "moment";
import { PositiveAmountEvent } from "./PositiveAmountEvent";

export class SpendEvent extends PositiveAmountEvent {
    static readonly NAME = "SpendEvent";

    constructor(amount: number) {
        super(SpendEvent.NAME, amount);
    }

    shortString(): string {
        return `Spend ${this.amount}`;
    }
}
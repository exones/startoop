import { Moment } from "moment";
import { PositiveAmountEvent } from "./PositiveAmountEvent";

export class EarnEvent extends PositiveAmountEvent {
    public static readonly NAME: string = "EarnEvent";

    constructor(amount: number) {
        super(EarnEvent.NAME, amount);
    }

    shortString(): string {
        return `Earn %{amount}EUR`;
    }
}
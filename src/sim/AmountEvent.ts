import { Moment } from "moment";
import { EventData } from "./event/EventData";

export abstract class AmountEvent extends EventData {
    readonly amount: number;

    shortString(): string {
        return `%{amount}EUR`;
    }

    constructor(name: string, amount: number) {
        super(name);

        this.amount = amount;
    }
}
import { Moment } from "moment";
import { AmountEvent } from "./AmountEvent";

export abstract class PositiveAmountEvent extends AmountEvent {
    constructor(name: string, amount: number) {
        super(name, amount);

        if (amount < 0) {
            throw new Error(`Amount must be positive (was give ${this.amount}).`);
        }
    }
}
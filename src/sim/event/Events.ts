import { EarnEvent } from "../EarnEvent";
import { SpendEvent } from "../SpendEvent";

export class Events {
    static earn(amount: number): () => EarnEvent {
        return () => new EarnEvent(amount);
    }

    static spend(amount: number): () => SpendEvent {
        return () => new SpendEvent(amount);
    }
}
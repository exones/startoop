import { Moment } from "moment";
import { INamed } from "../Named";
import { SystemEntity } from "../SystemEntity";

export abstract class EventData extends SystemEntity {
    constructor(name: string) {
        super(name);
    }

    shortString(): string {
        return "${this.name}";
    }
}
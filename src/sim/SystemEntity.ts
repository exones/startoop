import { INamed } from "./Named";

export abstract class SystemEntity implements INamed {
    readonly name: string;

    constructor(name: string) {
        this.name = name;
    }

    shortString(): string {
        return `Entity ${name}`;
    }

    toString(): string{
        return `${this.shortString} ${JSON.stringify(this)}`;
    }

    log(): void {
        console.log(this.toString());
    }
}
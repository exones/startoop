import { SystemEntity } from "./SystemEntity";

export class System extends SystemEntity {
    constructor(name: string) {
        super(name);
    }

    shortString(): string {
        return `System ${name}`;
    }

    eventStream(): void {

    }    
}
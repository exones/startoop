import { EventStreamImage } from './event/EventStreamImage';
import { SystemEntity } from "./SystemEntity";
import * as Collections from 'typescript-collections';

export class System extends SystemEntity {
    private eventStreams: Array<EventStreamImage> = [];

    getEventStreams(): Iterable<EventStreamImage> {
        return this.eventStreams;
    }

    constructor(name: string) {
        super(name);
    }

    shortString(): string {
        return `System ${name}`;
    }

    eventStream(name: string): EventStreamImage {
        const eventStreamImage = new EventStreamImage(name)
        this.eventStreams.push(eventStreamImage);

        return eventStreamImage;
    }
}
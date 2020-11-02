import { EventStreamImage } from './event/EventStreamImage';
import { SystemEntity } from "./SystemEntity";
import * as Collections from 'typescript-collections';
import { SensorImage } from './sensor/SensorImage';
import { SensorStyle } from './sensor/SensorTimeSeries';

export class SystemImage extends SystemEntity {
    private eventStreams: Array<EventStreamImage> = [];
    private sensors: Array<SensorImage<any>> = [];
    private entities: { [key: string]: SystemEntity} = {};

    getEventStreams(): Iterable<EventStreamImage> {
        return this.eventStreams;
    }

    getSensors(): Iterable<SensorImage<any>> {
        return this.sensors;
    }

    constructor(name: string) {
        super(name);
    }

    shortString(): string {
        return `System ${name}`;
    }

    private addEntity(entity: SystemEntity) {
        this.entities[entity.name] = entity;
    }

    eventStream(name: string): EventStreamImage {
        const eventStreamImage = new EventStreamImage(name);
        this.eventStreams.push(eventStreamImage);
        this.addEntity(eventStreamImage);

        return eventStreamImage;
    }

    sensor<TData>(name: string): SensorImage<TData> {
        const sensorImage = new SensorImage<TData>(name, SensorStyle.Impulse);
        this.sensors.push(sensorImage);
        this.addEntity(sensorImage);

        return sensorImage;
    }
}
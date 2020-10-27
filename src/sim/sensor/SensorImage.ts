import { Logger } from 'tslog';
import { EventData } from '../event/EventData';
import { LogRoot, newLogger } from '../log/LogRoot';
import { SystemEntity } from '../SystemEntity';
import { SensorEventReaction } from './SensorEventReaction';
import { SensorInitializer } from './SensorInitializer';

export class SensorImage<TData> extends SystemEntity {
    private readonly log : Logger = newLogger();
    initalizer: SensorInitializer<TData> = () => { return <TData>{}; };
    reactions: { [key: string]: SensorEventReaction<any, TData> } = {};

    constructor(name: string) {
        super(name);
    }

    init(initalizer: SensorInitializer<TData>): SensorImage<TData> {
        this.initalizer = initalizer;

        return this;
    }

    on<TEventData extends EventData>(cls: Function, reaction: SensorEventReaction<TEventData, TData>): SensorImage<TData> {
        const eventName : string = cls.name;
        if (this.reactions[eventName]) {
            this.log.warn(`Reaction for event '${eventName}' is already set in sensor '${this.name}'.`);

        }
        this.reactions[eventName] = reaction;

        return this;
    }
}
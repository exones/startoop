import { Logger } from "tslog";
import { Dictionary } from "typescript-collections";
import { EventData } from "../event/EventData";
import { newLogger } from "../log/LogRoot";
import { SystemEntity } from "../SystemEntity";
import { SensorEventReaction } from "./SensorEventReaction";
import { SensorInitializer } from "./SensorInitializer";
import { SensorStyle } from "./SensorTimeSeries";

export class SensorImage<TData> extends SystemEntity {
    private readonly log : Logger = newLogger();
    initalizer: SensorInitializer<TData> = () => { return <TData>{}; };
    reactions: Dictionary<string, SensorEventReaction<any, TData>> = new Dictionary<string, SensorEventReaction<any, TData>>();
    style: SensorStyle;

    constructor(name: string, style: SensorStyle) {
        super(name);
        this.style = style;
    }

    init(initalizer: SensorInitializer<TData>): SensorImage<TData> {
        this.initalizer = initalizer;

        return this;
    }

    on<TEventData extends EventData>(cls: Function, reaction: SensorEventReaction<TEventData, TData>): SensorImage<TData> {
        const eventName : string = cls.name;
        if (this.reactions.containsKey(eventName)) {
            this.log.warn(`Reaction for event '${eventName}' is already set for sensor '${this.name}'.`);

        }
        this.reactions.setValue(eventName, reaction);

        return this;
    }

    cumulative(): SensorImage<TData> {
        this.style = SensorStyle.Cumulative;

        return this;
    }
}
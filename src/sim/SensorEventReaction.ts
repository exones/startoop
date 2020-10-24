import { Event } from './event/Event';
import { EventData } from "./event/EventData";
import { System } from "./System";

export type SensorEventReaction<TEvent extends EventData> = (system: System, evt: Event<TEvent>) => void;

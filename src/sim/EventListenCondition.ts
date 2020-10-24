import { Event } from "./event/Event";
import { EventData } from "./event/EventData";

export type EventListenCondition<TEvent extends EventData> = ( evt: Event<TEvent>) => boolean;



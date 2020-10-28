import { Event } from '../event/Event';
import { EventData } from "../event/EventData";
import { SystemImage } from "../System";

export type SensorEventReaction<TEventData extends EventData, TData> = (system: SystemImage, evt: Event<TEventData>, data: TData) => TData;

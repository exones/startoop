import { EventData } from './EventData';

export type EventEmitter<T extends EventData> = () => T;
import { Moment, now } from "moment";
import { Logger } from "tslog";
import { isUndefined } from "typescript-collections/dist/lib/util";
import { Event } from "../event/Event";
import { EventStream } from "../event/EventStream";
import { newLogger } from "../log/LogRoot";
import { Sensor } from "../sensor/Sensor";
import { SystemImage } from "../System";
import { MomentUtils } from "../time/MomentUtils";
import { SimulationParameters } from "./SimulationParameters";
import { SimulationResult } from "./SimulationResult";
import { Timeline } from "./Timeline";
import { AnySensor } from "../sensor/AnySensor";
import { StringDictionary } from "../util/StringDictionary";
import { EventList } from "./EventList";
import { AnyEvent } from "../event/AnyEvent";
import { EventStreamImage } from '../event/EventStreamImage';
import { SensorImage } from '../sensor/SensorImage';
import { AnySensorImage } from '../sensor/AnySensorImage';
import { RecurrenceNextResult } from '../recurrence/RecurrenceNextResult';
import { EventData } from '../event/EventData';
import { Recurrence } from '../recurrence/Recurrence';
import { IRecurrence } from '../recurrence/IRecurrence';

interface ActualSimulationParameters {
    startDate: Moment;
    endDate: Moment;
}

export class Simulation {
    private readonly log: Logger = newLogger();

    private readonly params: ActualSimulationParameters;
    private readonly system: SystemImage;
    private eventStreams: Array<EventStream> = [];
    private sensors: Array<Sensor<any>> = [];
    private sensorsByEvent: StringDictionary<Array<AnySensor>>;
    private currentDate: Moment = MomentUtils.now();
    private timeline: Timeline;
    private first: boolean = true;

    constructor(system: SystemImage, params: SimulationParameters) {
        this.system = system;
        this.params = {
            startDate: MomentUtils.of(params.startDate),
            endDate: MomentUtils.of(params.endDate)
        };
        this.timeline = new Timeline(this.params.startDate, this.params.endDate);
        this.sensorsByEvent = new StringDictionary<Array<AnySensor>>();
    }

    private step(): boolean {
        if (this.first) {
            this.first = false
        } else {
            if (this.timeline.hasFinished()) {
                return false;
            }
        }

        const now: Moment = this.timeline.getNow();

        this.log.debug(`Now is ${now}`);
        // process current date events
        const events: EventList = this.timeline.getEventsForNow();
        while (events.size() > 0) {
            const event: AnyEvent | undefined = events.dequeue();

            if (isUndefined(event)) {
                break;
            }

            const sensors = this.sensorsByEvent.getValue(event.name);

            sensors?.forEach(sensor => sensor.react(this.system, event)); // here new events can be added
        }
        // here all the events from today are processed

        // let's schedule new events
        this.emitFromEventStreams();

        return this.timeline.advance();
    }

    private emitFromEventStreams(): void {
        const now = this.timeline.getNow();
        for (const eventStream of this.eventStreams) {
            this.log.debug(`Processing eventStream ${eventStream.image.name}.`);
            const recurrence: IRecurrence = eventStream.recurrence;
            const nextResult: RecurrenceNextResult = recurrence.next(false);

            if (!nextResult.done) {
                const currentDate: Moment | undefined = recurrence.getCurrent();
                const nextDate: Moment | undefined = nextResult.date;

                this.log.debug(`Now: ${now}, current: ${currentDate}, next: ${nextDate}`);
                if (isUndefined(nextDate)) {
                    throw new Error("Event stream not done, but date is undefined.");
                }

                if (currentDate === undefined || now.isBetween(currentDate, nextDate, "day", "[)")) {
                    recurrence.next(true);
                    const eventData: EventData = eventStream.image.emitter();
                    const event: AnyEvent = new Event(nextDate, eventData);

                    this.log.debug(`Emit new event for ${nextDate} from ${eventStream.image.name}.`);

                    this.timeline.scheduleEvent(event);
                }
            }
        }
    }

    private initializeEventStreams(): void {
        this.log.debug("Initializing event streams.");
        const evStreamImages: Iterable<EventStreamImage> = this.system.getEventStreams();

        for (const evStreamImage of evStreamImages) {
            const evStream: EventStream = new EventStream(evStreamImage, this.params.startDate);
            this.eventStreams.push(evStream);
        }
    }

    private initalizeSensors(): void {
        const sensorImages: Iterable<AnySensorImage> = this.system.getSensors();

        this.log.debug("Initializing sensors.");
        for (const sensorImage of sensorImages) {
            const sensor: AnySensor = new Sensor(sensorImage, this.params.startDate);

            for (const reacitonKey of sensor.image.reactions.keys()) {
                // tODO: create list
                this.sensorsByEvent.setValue(reacitonKey, [sensor]);
            }

            this.sensors.push(sensor);
        }
    }

    simulate(): SimulationResult {
        const startString = MomentUtils.toIsoString(this.params.startDate);
        const endString = MomentUtils.toIsoString(this.params.endDate);

        this.log.info(`Starting simulation (from ${startString} to ${endString})`);

        this.initializeEventStreams();
        this.initalizeSensors();

        this.emitFromEventStreams();

        this.log.debug("Starting stepping...");
        let i: number = 1;
        while (true) {
            this.log.debug(`Step ${i}`);
            const stepResult: boolean = this.step();
            if (stepResult === false) {
                this.log.debug(`Finished stepping after ${i} steps`);
                break;
            }
            i++;
        }

        return new SimulationResult();
    }
}
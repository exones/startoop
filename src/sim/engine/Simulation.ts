import { Moment, now } from "moment";
import { Logger } from "@/sim/log/Logger";
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
import { EventStreamImage } from "../event/EventStreamImage";
import { SensorImage } from "../sensor/SensorImage";
import { AnySensorImage } from "../sensor/AnySensorImage";
import { RecurrenceNextResult } from "../recurrence/RecurrenceNextResult";
import { EventData } from "../event/EventData";
import { Recurrence } from "../recurrence/Recurrence";
import { IRecurrence } from "../recurrence/IRecurrence";
import { Set } from "typescript-collections";
import { AmountData } from '../sensor/AmountData';

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
    private first = true;

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
            this.first = false;
        } else {
            if (this.timeline.hasFinished()) {
                return false;
            }
        }

        // process current date events
        const events: EventList = this.timeline.getEventsForNow();
        const now: Moment = events.date;
        this.log.debug(`Now is ${MomentUtils.toIsoString(now)}: ${events.size()} events scheduled.`);
        while (events.size() > 0) {
            const event: AnyEvent | undefined = events.dequeue();

            if (isUndefined(event)) {
                break;
            }

            this.log.debug(`Next event is ${event.name}: ${event}`);

            const sensors = this.sensorsByEvent.getValue(event.name);
            this.log.debug(`Reacting to event ${event}: ${sensors?.length} sensors will react.`);

            sensors?.forEach(sensor => sensor.react(this.system, event)); // here new events can be added
        }
        // here all the events from today are processed

        // let's schedule new events
        this.emitFromEventStreams();

        return this.timeline.advance();
    }

    private emitFromEventStreams(): void {
        const now : Moment = this.timeline.getNow();
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

                if ((currentDate === undefined && now.isSameOrBefore(nextDate)) || now.isBetween(currentDate, nextDate, "day", "[]")) {
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

            this.log.debug(`Sensor ${sensor.name} contains ${sensor.image.reactions.size()} reactions`);

            for (const eventName of sensor.image.reactions.keys()) {
                let sensorsList: Array<AnySensor> | undefined = this.sensorsByEvent.getValue(eventName);

                if (isUndefined(sensorsList)) {
                    sensorsList = [];
                    this.sensorsByEvent.setValue(eventName, sensorsList);
                }

                this.log.debug(`Sensor ${sensor.name} will react to ${eventName}.`);
                sensorsList.push(sensor);
            }
            this.sensors.push(sensor);
        }
    }

    simulate(): SimulationResult {
        const startString = MomentUtils.toIsoString(this.params.startDate);
        const endString = MomentUtils.toIsoString(this.params.endDate);

        this.log.info(`****** Starting simulation (from ${startString} to ${endString})`);

        this.initializeEventStreams();
        this.initalizeSensors();

        this.emitFromEventStreams();
        this.timeline.start();

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

        this.log.debug("Collecting simulation information...");

        const dates = new Set<Moment>(x => MomentUtils.toIsoString(x));
        const data: Array<Array<number>> = [];
        const sensorNames: Array<string> = [];

        for (const sensor of this.sensors) {
            const sensorDates = sensor.timeSeries.getDates();

            this.log.debug(`Sensor ${sensor.name}:`)
            for (const date of sensorDates) {
                dates.add(date);
                this.log.debug(`${MomentUtils.toIsoString(date)}: ${sensor.timeSeries.dataAt(date).amount}`);
            }

            data.push([]);
            sensorNames.push(sensor.name);
        }

        let allDates: Array<Moment> = dates.toArray();
        allDates = allDates.sort((a, b) => {
            if (a.isBefore(b)) {
                return -1;
            } else {
                return 1;
            }
        });

        this.log.debug(`Dates: ${JSON.stringify(dates)}`);

        for (let dateIndex: number = 0; dateIndex < allDates.length; dateIndex++) {
            const date: Moment = allDates[dateIndex];

            for (let sensorIndex: number = 0; sensorIndex < this.sensors.length; sensorIndex++) {
                const sensor: AnySensor = this.sensors[sensorIndex];
                data[sensorIndex].push((sensor.timeSeries.dataAt(date) as AmountData).amount);
            }
        }

        return new SimulationResult(sensorNames, allDates, data);
    }
}
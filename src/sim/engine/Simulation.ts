import { Moment, now } from "moment";
import { Logger } from "tslog";
import { isUndefined } from "typescript-collections/dist/lib/util";
import { Event } from "../event/Event";
import { AnyEvent } from "../event/AnyEvent";
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
import { ValueEventData } from '../event/ValueEventData';
import { SpendEvent } from '../SpendEvent';

interface ActualSimulationParameters {
    startDate: Moment;
    endDate: Moment;
}

export class Simulation {
    private readonly log : Logger = newLogger();

    private readonly params: ActualSimulationParameters;
    private readonly system: SystemImage;
    private eventStreams: Array<EventStream> = [];
    private sensors: Array<Sensor<any>> = [];
    private sensorsByEvent: StringDictionary<Array<AnySensor>>;
    private currentDate: Moment = MomentUtils.now();
    private timeline: Timeline;

    constructor(system: SystemImage, params: SimulationParameters) {
        this.system = system;
        this.params = {
            startDate: MomentUtils.of(params.startDate),
            endDate: MomentUtils.of(params.endDate)
        };
        this.timeline = new Timeline(this.params.startDate);
        this.sensorsByEvent = new StringDictionary<Array<AnySensor>>();
    }

    private step(): boolean {
        if (this.timeline.hasFinished()) {
            return false;
        }

        const now = this.timeline.getNow();

        // process current date events
        const events = this.timeline.getEventsForNow();
        while (events.size() > 0) {
            const event = events.dequeue();

            if (isUndefined(event)) {
                break;
            }

            const sensors = this.sensorsByEvent.getValue(event.name);

            sensors?.forEach(sensor => sensor.react(this.system, event)); // here new events can be added
            // TODO: check reacting sensors
        }
        // emit next events from streams


        // let evt: AnyEvent | undefined;
        // do {
        //     evt = this.timeline.getNextEvent();
        //     this.log.debug(`Event: ${evt?.shortString()}`);
        // } while (!isUndefined(evt));

        return true;
    }

    private initializeEventStreams(): void {
        this.log.debug("Initializing event streams.");
        const evStreamImages = this.system.getEventStreams();

        for (const evStreamImage of evStreamImages) {
            const evStream = new EventStream(evStreamImage, this.params.startDate);
            this.eventStreams.push(evStream);
        }
    }

    private initalizeSensors(): void {
        const sensorImages = this.system.getSensors();

        this.log.debug("Initializing sensors.");
        for (const sensorImage of sensorImages) {
            const sensor = new Sensor(sensorImage, this.params.startDate);

            for (const reacitonKey of sensor.image.reactions.keys()) {
                // tODO: create list
                this.sensorsByEvent.setValue(reacitonKey, [ sensor ]);
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

        for (const evStream of this.eventStreams) {
            for (let index = 0; index < 3; index++) {
                const res = evStream.recurrence.next();
                if (res.done) {
                    // TODO: remove from active streams
                    break;
                } else {
                    const date = res.date;
                    if (isUndefined(date)) {
                        throw new Error("Date is null. What?");
                    } else {
                        const eventData = evStream.image.emitter();
                        const evt = new Event(date, eventData);

                        this.timeline.scheduleEvent(evt);
                    }
                }
            }
        }

        this.log.debug("Starting stepping...");
        let i = 0;
        while (this.step()) {
            this.log.debug(`Step ${i}`);
            i++;
        }

        return new SimulationResult();
    }
}
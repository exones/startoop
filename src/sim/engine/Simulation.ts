import { Moment, now } from "moment";
import { Logger } from "tslog";
import { isUndefined } from 'typescript-collections/dist/lib/util';
import { Event } from '../event/Event';
import { AnyEvent } from "../event/AnyEvent";
import { EventStream } from '../event/EventStream';
import { newLogger } from "../log/LogRoot";
import { Sensor } from '../sensor/Sensor';
import { SystemImage } from "../System";
import { MomentUtils } from "../time/MomentUtils";
import { SimulationParameters } from "./SimulationParameters";
import { SimulationResult } from "./SimulationResult";
import { Timeline } from './Timeline';

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
    private currentDate: Moment = MomentUtils.now();
    private timeline: Timeline;

    constructor(system: SystemImage, params: SimulationParameters) {
        this.system = system;
        this.params = {
            startDate: MomentUtils.of(params.startDate),
            endDate: MomentUtils.of(params.endDate)
        };
        this.timeline = new Timeline(this.params.startDate);
    }

    private step(): void {
        for (const evStream of this.eventStreams) {
            for (let index = 0; index < 20; index++) {
                const res = evStream.recurrence.next();
                if (res.done) {
                    // TODO: remove from active streams
                    break;
                } else {
                    const date = res.date;
                    if (isUndefined(date)) {
                        throw new Error("Date is null.");
                    } else {
                        const eventData = evStream.image.emitter();
                        const evt = new Event(date, eventData);

                        this.timeline.scheduleEvent(evt);
                    }
                }
            }
        }

        let evt: AnyEvent | undefined;
        do {
            evt = this.timeline.getNextEvent();
            this.log.debug(`Event: ${evt?.shortString()}`);
        } while (!isUndefined(evt));
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
            this.sensors.push(sensor);
        }
    }

    simulate(): SimulationResult {
        this.log.info(`Starting simulation (from ${MomentUtils.toIsoDate(this.params.startDate)} to ${MomentUtils.toIsoDate(this.params.endDate)})`);
        this.initializeEventStreams();
        this.initalizeSensors();

        this.step();

        return new SimulationResult();
    }
}
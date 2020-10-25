import { Moment, now } from "moment";
import { Logger } from "tslog";
import { EventStream } from '../event/EventStream';
import { newLogger } from "../log/LogRoot";
import { System } from "../System";
import { MomentUtils } from "../time/MomentUtils";
import { SimulationParameters } from "./SimulationParameters";
import { SimulationResult } from "./SimulationResult";

interface ActualSimulationParameters {
    startDate: Moment;
    endDate: Moment;
}

export class Simulation {
    private readonly log : Logger = newLogger("Simulation");

    private readonly params: ActualSimulationParameters;
    private readonly system: System;
    private eventStreams: Array<EventStream> = [];
    private currentDate: Moment = MomentUtils.now();

    constructor(system: System, params: SimulationParameters) {
        this.system = system;
        this.params = {
            startDate: MomentUtils.of(params.startDate),
            endDate: MomentUtils.of(params.endDate)
        };
    }

    private step(): void {
        for (const evStream of this.eventStreams) {
            for (let index = 0; index < 20; index++) {
                const res = evStream.recurrence.next();

                this.log.debug(`${res.date}`);

                if (res.done) {
                    break;
                }
            }
        }
    }

    private initializeEventStreams(): void {
        const evStreamImages = this.system.getEventStreams();

        for (const evStreamImage of evStreamImages) {
            const evStream = new EventStream(evStreamImage, this.params.startDate);
            this.eventStreams.push(evStream);
        }
    }

    simulate(): SimulationResult {
        this.log.info(`Starting simulation (from ${MomentUtils.toIsoDate(this.params.startDate)} to ${MomentUtils.toIsoDate(this.params.endDate)})`);
        this.initializeEventStreams();

        this.step();

        return new SimulationResult();
    }
}
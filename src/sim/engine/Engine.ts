import { SystemImage } from "../System";
import { Simulation } from "./Simulation";
import { SimulationParameters } from "./SimulationParameters";
import { SimulationResult } from "./SimulationResult";

export class Engine {
    simulate(system: SystemImage, params: SimulationParameters): SimulationResult {
        const simulation : Simulation = new Simulation(system, params);

        return simulation.simulate();
    }
}
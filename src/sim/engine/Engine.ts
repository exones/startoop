import { System } from "../System";
import { Simulation } from "./Simulation";
import { SimulationParameters } from "./SimulationParameters";
import { SimulationResult } from "./SimulationResult";

export class Engine {
    simulate(system: System, params: SimulationParameters): SimulationResult {
        const simulation = new Simulation(system, params);

        return simulation.simulate();
    }
}
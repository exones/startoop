import { Engine } from '@/sim/engine/Engine';
import { SimulationParameters } from '@/sim/engine/SimulationParameters';
import { Events } from '@/sim/event/Events';
import { LogRoot } from '@/sim/log/LogRoot';
import { System } from "@/sim/System";
import { MomentUtils } from '@/sim/time/MomentUtils';
import "@/sim/time/PeriodExtensions";

describe("system", () => {
    it("try", () => {
        var sys = new System("test");

        const salary = sys
            .eventStream("salary")
            .from((1).month())
            .each((1).month())
            .emit(Events.spend(1000));

        const engine = new Engine();

        const simParams = <SimulationParameters> {
            startDate: "2021-01-01",
            endDate: "2025-01-01"
        }
        const result = engine.simulate(sys, simParams);

        console.log(result);
    });
});
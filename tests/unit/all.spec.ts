import { EarnEvent } from "@/sim/EarnEvent";
import { Engine } from "@/sim/engine/Engine";
import { SimulationParameters } from "@/sim/engine/SimulationParameters";
import { SimulationResult } from "@/sim/engine/SimulationResult";
import { Events } from "@/sim/event/Events";
import { EventStreamImage } from "@/sim/event/EventStreamImage";
import { newLogger } from "@/sim/log/LogRoot";
import { SpendEvent } from "@/sim/SpendEvent";
import { SystemImage } from "@/sim/System";
import "@/sim/time/PeriodExtensions";

interface AmountData {
    readonly amount: number;
}

describe("system", () => {
    const log = newLogger();
    it("try", () => {
        var sys = new SystemImage("test");

        const salary : EventStreamImage = sys
            .eventStream("salary")
            // .from((0).month())
            .each((1).month())
            .emit(Events.spend(1000));
            // .then().after((1).year)
            // .emit(Events.spend(2000));

        sys.eventStream("SFIL")
            .each((2).months())
            .emit(Events.earn(4000));

        sys
            .sensor<AmountData>("balance")
            .cumulative()
            .init(() => { return { amount: 0 }; })
            .on<EarnEvent>(EarnEvent, (sys, evt, data) => {
                return { ...data, amount: data.amount + evt.data.amount };
            })
            .on<SpendEvent>(SpendEvent, (sys, evt, data) => {
                return { ...data, amount: data.amount - evt.data.amount };
            });

        sys
            .sensor<AmountData>("spendings")
            .init(() => { return { amount: 0 }; })
            .on<SpendEvent>(SpendEvent, (sys, evt, data) => {
                return { amount: -evt.data.amount };
            });

        sys
            .sensor<AmountData>("earnings")
            .init(() => { return { amount: 0 }; })
            .on<EarnEvent>(EarnEvent, (sys, evt, data) => {
                return { amount: evt.data.amount };
            });

        const engine : Engine = new Engine();

        const simParams : SimulationParameters = {
            startDate: "2021-01-01",
            endDate: "2021-06-01"
        };

        const result : SimulationResult = engine.simulate(sys, simParams);

        console.log(JSON.stringify(result));
    });
});
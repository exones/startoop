import { EarnEvent } from '@/sim/EarnEvent';
import { Engine } from '@/sim/engine/Engine';
import { SimulationParameters } from '@/sim/engine/SimulationParameters';
import { Events } from '@/sim/event/Events';
import { LogRoot } from '@/sim/log/LogRoot';
import { SpendEvent } from '@/sim/SpendEvent';
import { SystemImage } from "@/sim/System";
import { MomentUtils } from '@/sim/time/MomentUtils';
import "@/sim/time/PeriodExtensions";

interface AmountData {
    readonly amount: number;
}

describe("system", () => {
    it("try", () => {
        var sys = new SystemImage("test");

        const salary = sys
            .eventStream("salary")
            .from((1).month())
            .each((1).month())
            .emit(Events.spend(1000));
            // .then().after((1).year)
            // .emit(Events.spend(2000));

        // sys
        //     .sensor("positive")
        //     .init(data => {
        //         data.curr = 0;
        //     })
        //     .on<EarnEvent>(EarnEvent, (evt, data) => {
        //         data.curr = data.curr + evt.amount;
        //     });

        // sys
        //     .sensor("negative")
        //     .init(data => {
        //         data.curr = 0;
        //     })
        //     .on(EarnEvent)
        //     .update((evt, data) => {
        //         data.curr = data.curr + evt.amount;
        //     });

        sys
            .sensor<AmountData>("balance")
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
                return { ...data, amount: data.amount - evt.data.amount };
            });

        sys
            .sensor<AmountData>("earnings")
            .init(() => { return { amount: 0 }; })
            .on<SpendEvent>(SpendEvent, (sys, evt, data) => {
                return { ...data, amount: data.amount + evt.data.amount };
            });

        const engine = new Engine();

        const simParams = <SimulationParameters>{
            startDate: "2021-01-01",
            endDate: "2025-01-01"
        }
        const result = engine.simulate(sys, simParams);

        console.log(result);
    });
});
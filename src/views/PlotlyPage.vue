<template>
  <div ref="bar"></div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Plotly from "plotly.js";
import { SystemImage } from "@/sim/System";
import { EventStreamImage } from "@/sim/event/EventStreamImage";
import { Events } from "@/sim/event/Events";
import { EarnEvent } from "@/sim/EarnEvent";
import { SpendEvent } from "@/sim/SpendEvent";
import { Engine } from "@/sim/engine/Engine";
import { SimulationParameters } from "@/sim/engine/SimulationParameters";
import { SimulationResult } from "@/sim/engine/SimulationResult";
import { newLogger } from '@/sim/log/LogRoot';
import { Logger } from "@/sim/log/Logger";

interface AmountData {
  readonly amount: number;
}

@Component
export default class PlotlyPage extends Vue {
  rows: Array<any> = [];
  constructor() {
    super();
  }

  mounted() {
    const sys = new SystemImage("test");

    const salary: EventStreamImage = sys
      .eventStream("salary")
      // .from((0).month())
      .each((1).month())
      .emit(Events.spend(1000));
    // .then().after((1).year)
    // .emit(Events.spend(2000));

    sys
      .eventStream("SFIL")
      .each((2).months())
      .emit(Events.earn(4000));

    sys
      .sensor<AmountData>("balance")
      .cumulative()
      .init(() => {
        return { amount: 0 };
      })
      .on<EarnEvent>(EarnEvent, (sys, evt, data) => {
        const newData = { ...data, amount: data.amount + evt.data.amount };

        return newData;
      })
      .on<SpendEvent>(SpendEvent, (sys, evt, data) => {
        const newData = { ...data, amount: data.amount - evt.data.amount };

        return newData;
      });

    sys
      .sensor<AmountData>("spendings")
      .init(() => {
        return { amount: 0 };
      })
      .on<SpendEvent>(SpendEvent, (sys, evt, data) => {
        return { ...data, amount: data.amount - evt.data.amount };
      });

    sys
      .sensor<AmountData>("earnings")
      .init(() => {
        return { amount: 0 };
      })
      .on<EarnEvent>(EarnEvent, (sys, evt, data) => {
        return { ...data, amount: data.amount + evt.data.amount };
      });

    const engine: Engine = new Engine();

    const simParams: SimulationParameters = {
      startDate: "2021-01-01",
      endDate: "2021-06-01"
    };

    const log = new Logger();


    // const result: SimulationResult = engine.simulate(sys, simParams);

    Plotly.newPlot(
      this.$refs.bar as HTMLElement,
      [
        {
          x: ["giraffes", "orangutans", "monkeys"],
          y: [20, 14, 23],
          name: "SF Zoo",
          type: "bar"
        },
        {
          x: ["giraffes", "orangutans", "monkeys"],
          y: [12, 18, 29],
          name: "LA Zoo",
          type: "bar"
        }
      ],
      {
        barmode: "group",
        margin: { t: 0, l: 0, b: 0, r: 0 }
      }
    );
  }
}
</script>

<style scoped>
.js-plotly-plot {
  max-width: 100%;
}
</style>
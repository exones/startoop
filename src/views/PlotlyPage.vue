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
import { AmountData } from "@/sim/sensor/AmountData";
import { Logger } from "@/sim/log/Logger";
import { MomentUtils } from '@/sim/time/MomentUtils';


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
      .emit(Events.spend(10000));
    // .then().after((1).year)
    // .emit(Events.spend(2000));

    sys
      .eventStream("salary2")
      .from((1).year())
      .each((1).month())
      .emit(Events.spend(10000));

    sys
      .eventStream("SFIL")
      .each((1).year())
      .emit(Events.earn(60000));
    
    sys
      .eventStream("SNCF")
      .from((1).year())
      .each((1).year())
      .emit(Events.earn(100000));

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
      endDate: "2025-01-01"
    };

    const result: SimulationResult = engine.simulate(sys, simParams);

    console.log(result);

    const x = result.dates.map(x => MomentUtils.toIsoString(x));

    Plotly.newPlot(
      this.$refs.bar as HTMLElement,
      [
        {
          x,
          y: result.data[0],
          name: "balance",
          type: "scatter"
        },
        {
          x,
          y: result.data[1],
          name: "spendings",
          type: "bar"
        },
        {
          x,
          y: result.data[2],
          name: "earnings",
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
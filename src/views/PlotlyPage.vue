<template>
  <div ref="bar"></div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Plotly from "plotly.js";

@Component
export default class PlotlyPage extends Vue {
  rows: Array<any> = [];
  constructor() {
    super();
  }

  mounted() {
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
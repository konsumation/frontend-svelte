<script>
  import { Link } from "svelte-guard-history-router";
  import { TimeSeries, DataSet } from "svelte-time-series";

  import { categories } from "../store.mjs";
  import { category, values } from "../main.mjs";
  export let context;

  const padding = { top: 20, right: 15, bottom: 22, left: 25 };
  const yTicks = [0, 3, 6, 9, 12];
  const xTicks = [941673600, 1566467076];
  let points = [{x:941673600, y:0}];

  $: {
    const vv = $values;

    if (vv) {
      points = [];
      let last = vv[0].value;

      for (const { value, time } of vv) {
        const y = value - last;

        if (time > 0 && y >= 0) {
          points.push({ x: time, y });
        }
        last = value;
      }

      console.log(points);
    }
  }

  const width = 1000;
  const height = 300;
</script>

<div>

  {#if category}
    <h1>{category.name}</h1>

    <TimeSeries {padding} {width} {height} {xTicks} {yTicks} {points}>
      <DataSet {padding} {width} {height} {xTicks} {yTicks} {points} />
    </TimeSeries>
  {:else}No such category {context.props.category}{/if}
</div>

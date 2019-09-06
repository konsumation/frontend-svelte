<script>
  import { Link } from "svelte-guard-history-router";
  import { TimeSeries, DataSet } from "svelte-time-series";
  import { category, values } from "../main.mjs";
  export let state;

  const padding = { top: 20, right: 15, bottom: 22, left: 25 };
  const yTicks = [0, 5, 10, 16, 20];
  const xTicks = [941673600, 1566467076];
  let points = [{ x: 941673600, y: 0 }];

  $: {
    const vv = $values;

    if (vv) {
      points = [];
      let last = vv[0];

      for (const c of vv) {
        const days = (c.time - last.time) / (24 * 60 * 60);
        const y = (c.value - last.value) / days;

        if (c.time > 0 && y >= 0) {
          points.push({ x: c.time, y });
        }
        last = c;
      }
    }
  }

  const width = 1500;
  const height = 300;
</script>

<div>
  {#if $category}
    <h1>{$category.name}</h1>
    {$category.unit}
    <div>{$category.description}</div>
    <TimeSeries {padding} {width} {height} {xTicks} {yTicks} {points}>
      <DataSet {padding} {width} {height} {xTicks} {yTicks} {points} />
    </TimeSeries>
  {:else}No such category {JSON.stringify(state.props)}{/if}
</div>

<script>
  import { Link } from "svelte-guard-history-router";
  import { TimeSeries, DataSet } from "svelte-time-series";

  export let router;
  
  const route = router.route;
  
  const padding = { top: 20, right: 15, bottom: 22, left: 25 };
  const yTicks = [0, 5, 10, 16, 20];
  const xTicks = [941673600, 1566467076];
  let points = [{ x: 941673600, y: 0 }];

  $: {
    const vv = $route;

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

{#if $route && points.length}
  <TimeSeries {padding} {width} {height} {xTicks} {yTicks} {points}>
    <DataSet {padding} {width} {height} {xTicks} {yTicks} {points} />
  </TimeSeries>
{:else}No such category{/if}

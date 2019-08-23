<script>
  import { Link } from "svelte-guard-history-router";
  import { TimeSeries, DataSet } from "svelte-time-series";

  import { categories } from "../store.mjs";
  import { category, values } from "../main.mjs";
  export let context;

  /*
  let category;

  const categoryKey = context.keys.get("category");

  $: category = $categories.find(c => c.name === $categoryKey);
*/

  $: console.log($values);

  const points = [
    { x: 1979, y: 7.19 },
    { x: 1980, y: 7.83 },
    { x: 1981, y: 7.24 },
    { x: 1982, y: 7.44 },
    { x: 1983, y: 7.51 },
    { x: 1984, y: 7.1 },
    { x: 1985, y: 6.91 },
    { x: 1986, y: 7.53 },
    { x: 1987, y: 7.47 },
    { x: 1988, y: 7.48 },
    { x: 1989, y: 7.03 },
    { x: 1990, y: 6.23 },
    { x: 1991, y: 6.54 },
    { x: 1992, y: 7.54 },
    { x: 1993, y: 6.5 },
    { x: 1994, y: 7.18 },
    { x: 1995, y: 6.12 },
    { x: 1996, y: 7.87 },
    { x: 1997, y: 6.73 },
    { x: 1998, y: 6.55 },
    { x: 1999, y: 6.23 },
    { x: 2000, y: 6.31 },
    { x: 2001, y: 6.74 },
    { x: 2002, y: 5.95 },
    { x: 2003, y: 6.13 },
    { x: 2004, y: 6.04 },
    { x: 2005, y: 5.56 },
    { x: 2006, y: 5.91 },
    { x: 2007, y: 4.29 },
    { x: 2008, y: 4.72 },
    { x: 2009, y: 5.38 },
    { x: 2010, y: 4.92 },
    { x: 2011, y: 4.61 },
    { x: 2012, y: 3.62 },
    { x: 2013, y: 5.35 },
    { x: 2014, y: 5.28 },
    { x: 2015, y: 4.63 },
    { x: 2016, y: 4.72 }
  ];
  const padding = { top: 20, right: 15, bottom: 22, left: 25 };
  const yTicks = [0, 2, 4, 6, 8];
  const xTicks = [1980, 1990, 2000, 2010];

  const width = 600;
  const height = 300;
</script>

<div>

  {#if category}
    <h1>{category.name}</h1>

    <TimeSeries {padding} {width} {height} {xTicks} {yTicks} {points}>
      <DataSet {padding} {width} {height} {xTicks} {yTicks} {points} />
    </TimeSeries>

<!--
    <table>
      <tbody>
        {#each $values as { time, value }, i}
          <tr>
            <td>{time}</td>
            <td>{value}</td>
          </tr>
        {/each}
      </tbody>
    </table>
    -->
  {:else}No such category {context.props.category}{/if}
</div>

<script>
  import { onDestroy } from "svelte";
  import { Link } from "svelte-guard-history-router";
  import { category, values } from "../main.mjs";
  export let state;

  const dateFormatter = new Intl.DateTimeFormat("default", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour12: false,
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit"
  });

  const date = new Date();

  function asDate(time) {
    date.setTime(time * 1000);
    return dateFormatter.format(date);
  }
</script>

{#if $category}
<table class="bordered striped hoverable">
  <thead>
    <th>Date</th>
    <th>Value</th>
  </thead>
  <tbody>
    {#each $values as entry}
      <tr>
        <td>{asDate(entry.time)}</td>
        <td>{entry.value}</td>
      </tr>
    {/each}
  </tbody>
</table>
{/if}
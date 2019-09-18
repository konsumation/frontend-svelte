<script>
  import { onDestroy } from "svelte";
  import { Link } from "svelte-guard-history-router";
  import { dateFormatter } from "svelte-common";

  import { category, values } from "../main.mjs";
  export let state;

  const date = new Date();

  function asDate(time) {
    date.setTime(time * 1000);
    return dateFormatter.format(date);
  }
</script>

{#if $category && $values}
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
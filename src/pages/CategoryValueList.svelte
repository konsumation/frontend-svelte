<script>
  import { Link } from "svelte-guard-history-router";
  import { DateTime } from "svelte-common";
  import { categoryRoute, valuesListRoute } from "../main.mjs";

  function time2Date(time) {
    const date = new Date();
    date.setTime(time * 1000);
    return date;
  }
</script>

{#if $valuesListRoute}
<table class="bordered striped hoverable">
  <thead>
    <th>Date</th>
    <th>Value</th>
  </thead>
  <tbody>
    {#each $valuesListRoute as entry}
      <tr>
        <td><DateTime date={time2Date(entry.time)}/></td>
        <td>{entry.value}</td>
      </tr>
    {/each}
  </tbody>
</table>
{/if}
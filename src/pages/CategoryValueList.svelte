<script>
  import { Link } from "svelte-guard-history-router";
  import { DateTime } from "svelte-common";
  import { category, values } from "../main.mjs";

  function time2Date(time) {
    const date = new Date();
    date.setTime(time * 1000);
    return date;
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
        <td><DateTime date={time2Date(entry.time)}/></td>
        <td>{entry.value}</td>
      </tr>
    {/each}
  </tbody>
</table>
{/if}
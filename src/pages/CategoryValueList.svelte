<script>
  import { Link } from "svelte-guard-history-router";
  import { DateTime } from "svelte-common";

  export let router;
  
  const route = router.route;
  
  function time2Date(time) {
    const date = new Date();
    date.setTime(time * 1000);
    return date;
  }
</script>

{#if $route}
<table class="bordered striped hoverable">
  <thead>
    <th>Date</th>
    <th>Value</th>
  </thead>
  <tbody>
    {#each $route as entry, i}
      <tr id={i === 0 ? 'first' : i === $route.length - 1 ? 'last' : ''}>
        <td><DateTime date={time2Date(entry.time)}/></td>
        <td>{entry.value}</td>
      </tr>
    {/each}
  </tbody>
</table>
{/if}
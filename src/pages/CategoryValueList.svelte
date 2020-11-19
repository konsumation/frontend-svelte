<script>
  import { DateTime } from "svelte-common";

  export let router;

  const route = router.route;
  const entries = $route.value;

  function time2Date(time) {
    const date = new Date();
    date.setTime(time * 1000);
    return date;
  }

  setTimeout(() => {
    if (router.path.match(/#last/)) {
      const last = document.getElementById("last");
      if (last) {
        last.scrollIntoView();
      }
    }
  }, 1000);
</script>

{#if entries}
  <table class="bordered striped hoverable">
    <thead>
      <th>Date</th>
      <th>Value</th>
    </thead>
    <tbody>
      {#each entries as entry, i}
        <tr id={i === 0 ? 'first' : i === entries.length - 1 ? 'last' : ''}>
          <td>
            <DateTime date={time2Date(entry.time)} />
          </td>
          <td>{entry.value}</td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}

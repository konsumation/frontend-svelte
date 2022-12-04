<script>
  import {
    DateTime,
    sortable,
    sorter,
    filter,
    keyPrefixStore
  } from "svelte-common";
  import { CommandButton, ConfirmCommand } from "svelte-command";

  export let router;

  const route = router.route;
  const entries = $route.value;

  const categoryRoute = route.parent.parent;
  const category = $categoryRoute.value;

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

  //TODO refresh Site after delete value action

  const sortBy = keyPrefixStore(router.searchParamStore, "sort.");
  const filterBy = keyPrefixStore(router.searchParamStore, "filter.");
</script>

<h1>{category.name}</h1>

{#if entries}
  <table class="bordered striped hoverable">
    <colgroup>
      <col class="date"/>
      <col class="value"/>
      <col class="action"/>
    </colgroup>      
    <thead>
      <th id="date" use:sortable={sortBy}>Date</th>
      <th id="value" use:sortable={sortBy}>Value</th>
      <th>Action</th>
    </thead>
    <tbody>
      {#each route.value
        .filter(filter($filterBy))
        .sort(sorter($sortBy)) as entry, i}
        <tr id={i === 0 ? "first" : i === entries.length - 1 ? "last" : ""}>
          <td>
            <DateTime date={time2Date(entry.time)} />
          </td>
          <td>{entry.value}</td>
          <td>
            <CommandButton
              command={new ConfirmCommand(
                category.deleteValueCommand(entry.time, async response => {
                  route.value = entries.splice(i, 1);
                })
              )}
            /></td
          >
        </tr>
      {/each}
    </tbody>
  </table>
{/if}

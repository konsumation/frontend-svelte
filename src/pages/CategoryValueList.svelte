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
  <table class="bordered">
    <colgroup>
      <col class="date" />
      <col class="value" />
      <col class="action" />
    </colgroup>
    <thead>
      <tr>
        <th id="date" use:sortable={sortBy}>Date</th>
        <th id="value" use:sortable={sortBy}>Value</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody class="striped hoverable">
      {#each route.value
        .filter(filter($filterBy))
        .sort(sorter($sortBy)) as entry, i}
        <tr id={i === 0 ? "first" : i === entries.length - 1 ? "last" : ""}>
          <td>
            <DateTime date={entry.date} />
          </td>
          <td class="value">{entry.value}</td>
          <td>
            <CommandButton
              command={new ConfirmCommand(
                category.deleteValueCommand(entry.date, async response => {
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

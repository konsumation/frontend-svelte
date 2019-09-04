<script>
  import { Link } from "svelte-guard-history-router";
  import { categories }  from "../main.mjs";

  export let state;
</script>

<div>
  <table class="bordered striped hoverable">
    <thead>
      <tr>
        <th aria-sort="none">Name</th>
        <th aria-sort="none">Unit</th>
        <th aria-sort="none">Description</th>
      </tr>
    </thead>
    <tbody>
      {#each $categories as category (category.name)}
        <tr>
          <td>
            <Link href="/category/{category.name}">{category.name}</Link>
          </td>
          <td>{category.unit}</td>
          <td>{category.description}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

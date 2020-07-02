<script>
  import { ObjectLink } from "svelte-guard-history-router";
  import { categoriesRoute }  from "../main.mjs";
</script>

<div>
  <table class="bordered striped hoverable">
    <thead>
      <tr>
        <th aria-sort="none">Name</th>
        <th aria-sort="none">Description</th>
        <th aria-sort="none">Unit</th>
      </tr>
    </thead>
    <tbody>
      {#each $categoriesRoute as category (category.name)}
        <tr>
          <td>
            <ObjectLink object={category}/>
          </td>
          <td>{category.description}</td>
          <td>{category.unit}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<script>
  import { Link } from "svelte-guard-history-router";
  import { category } from "../main.mjs";

  let active;

  async function submit() {
    active = true;

    try {
      await $category.save();
    }
    finally {
      active = false;
    }
  }
</script>

<div>
  <h1>{$category.name}</h1>
  <form on:submit|preventDefault={submit}>
    <label for="description">
      Description
      <input
        id="description"
        type="text"
        placeholder="Description"
        name="description"
        required
        bind:value={$category.description} />
    </label>
    <label for="unit">
      Unit
      <input
        id="unit"
        type="text"
        placeholder="Unit"
        name="unit"
        required
        bind:value={$category.unit} />
    </label>

    <button id="submit" type="submit">
      Save
      {#if active}
        <div class="spinner" />
      {/if}
    </button>
  </form>

  <ul>
    <li>
      <Link href="/category/{$category.name}/list">List</Link>
    </li>
    <li>
      <Link href="/category/{$category.name}/graph">Graph</Link>
    </li>
  </ul>
</div>

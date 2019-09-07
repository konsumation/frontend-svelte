<script>
  import { createEventDispatcher } from "svelte";

  export let category;
  export let value;

  const dispatch = createEventDispatcher();

  function insert() {
    dispatch("message", {
      text: "Hello!"
    });
  }
</script>

<fieldset>
  <label for="{category.name}.value">
    {category.name} ({category.unit})
    <input
      id="{category.name}.value"
      type="text"
      placeholder="Value"
      name="{category.name}.value"
      required
      bind:value />
  </label>

  <button id="{category.name}.submit" type="submit" on:click|once={insert}>
    Insert
  </button>
</fieldset>

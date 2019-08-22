<script>
  import { Link } from "svelte-guard-history-router";
  import { categories } from "../store.mjs";
  export let context;

  let category;

  const categoryKey = context.keys.get('category');

  $: category = $categories.find(c => c.name === $categoryKey);

</script>

<div>

{#if category}
<h1>{category.name}</h1>
{:else}
No such category {context.props.category}
{/if}
</div>

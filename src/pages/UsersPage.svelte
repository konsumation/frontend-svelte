<script>
  import { ObjectLink } from "svelte-guard-history-router";

  let { router } = $props();

  const route = router.route;
  const users = $route.value;
</script>

<ul>
  {#each users as user}
    <li>
      <ObjectLink object={user} />
    </li>
  {/each}
</ul>

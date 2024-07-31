<script>
  import { ObjectLink } from "svelte-guard-history-router";
  let { router } = $props();

  const route = router.route;
  const user = $route.value;
</script>

<h1>{user.cn}</h1>

<table>
  {#each Object.entries(user) as kv}
    <tr>
      <td>{kv[0]}</td>
      <td>{kv[1]}</td>
    </tr>
  {/each}
</table>

<ObjectLink object={user} suffix="/entitlements">Entitlements</ObjectLink>

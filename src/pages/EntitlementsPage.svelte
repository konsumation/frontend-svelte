<script>
  import { EntitlementBadges } from "svelte-entitlement";

  export let router;

  const route = router.route;
  const entitlements = $route.value;
</script>

<EntitlementBadges {entitlements} />

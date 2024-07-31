<script>
  import { EntitlementBadges } from "svelte-entitlement";

  let { router } = $props();

  const route = router.route;
  const entitlements = $route.value;
</script>

<EntitlementBadges {entitlements} />

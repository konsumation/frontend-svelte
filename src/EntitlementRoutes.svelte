<script>
  import { Route, MasterRoute } from "svelte-guard-history-router";
  import { Entitlement } from "svelte-entitlement";
  import EntitlementsPage from "./pages/EntitlementsPage.svelte";
  import { fetchIterator } from "./util.mjs";

  export let session;
  export let guards;
</script>

<Route
  path="/entitlement"
  factory={MasterRoute}
  iteratorFor={transition => fetchIterator('/entitlement', Entitlement, session)}
  objectInstance={Entitlement}
  component={EntitlementsPage}
  {guards}>
  <slot />
</Route>

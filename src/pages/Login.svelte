<script>
  import { Login } from "svelte-session-manager";
  import { Modal } from "svelte-common";
  import { session } from "../util.mjs";
  import { api } from "../constants.mjs";

  let { router } = $props();
</script>

<Modal close={() => router.abort("/")}>
  <Login
    {session}
    endpoint={api + "/authenticate"}
    result={() => router.continue("/")}
  />
</Modal>

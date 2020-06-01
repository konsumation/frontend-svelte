<script>
  import { Login } from "svelte-session-manager";
  import { session, router } from "../main.mjs";
  import api from "consts:api";

  async function result() {
    const transition = router.transition;

    if (transition) {
      transition.continue();
    }
  }
</script>

<div class="center">
  <Login {session} endpoint={api + '/authenticate'} {result} />
</div>

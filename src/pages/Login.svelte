<script>
  import { Login } from "svelte-session-manager";
  import { session } from "../main.mjs";
  import api from "consts:api";

  export let state;

  async function result() {
    const transition = state.router.transition;

    if (transition) {
      transition.continue();
    }
  }
</script>

<div class="center">
  <Login {session} endpoint={api + '/authenticate'} {result} />
</div>

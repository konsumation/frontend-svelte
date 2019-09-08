<script>
  import { config } from "../../package.json";
  import { Login } from "svelte-session-manager";
  import { session } from "../main.mjs";

  export let state;
</script>

<div class="center">
  <Login {session} endpoint={config.api + '/authenticate'} />
</div>

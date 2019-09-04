<script>
  import { config } from "../../package.json";
  import { Login } from "svelte-session-manager";
  export let state;
</script>

<div class="center">
  <Login endpoint={config.api + "/authenticate"}/>
</div>

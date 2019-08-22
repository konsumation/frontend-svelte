<script>
  import { config } from "../../package.json";
  import { Login } from "svelte-session-manager";
  export let context;
</script>

<div>
  <Login endpoint={config.api + "/authenticate"}/>
</div>

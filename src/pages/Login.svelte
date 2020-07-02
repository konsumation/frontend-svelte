<script>
  import { Login } from "svelte-session-manager";
  import { router } from "../main.mjs";
  import { session } from "../util.mjs";

  import api from "consts:api";
</script>

<div class="center">
  <Login
    {session}
    endpoint={api + '/authenticate'}
    result={() => router.continue()} />
</div>

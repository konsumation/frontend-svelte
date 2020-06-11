<script>
  import { Login } from "svelte-session-manager";
  import { session, router } from "../main.mjs";
  import api from "consts:api";
</script>

<div class="center">
  <Login {session} endpoint={api + '/authenticate'} result={() =>router.continue()} />
</div>

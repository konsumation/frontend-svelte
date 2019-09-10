<script>
  import { config } from "../../package.json";
  import { session } from "../main.mjs";

  let active = false;

  async function backup() {
    active = true;
    try {
      await fetch(config.api + "/admin/backup", {
        headers: session.authorizationHeader
      });
    } finally {
      active = false;
    }
  }
</script>

<div>
  <button type="submit" on:click|once={backup}>
    Backup
    {#if active}
      <div class="spinner" />
    {/if}
  </button>
</div>

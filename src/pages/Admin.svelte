<script>
  import { config } from "../../package.json";
  import { session } from "../main.mjs";
  import ActionButton from "../components/ActionButton.svelte";

  async function backup() {
    await fetch(config.api + "/admin/backup", {
      headers: session.authorizationHeader
    });
  }

  async function restore() {
    await fetch(config.api + "/admin/restore", {
      method: 'POST',
      headers: session.authorizationHeader
    });
  }
</script>

<div>
  <ActionButton action={backup}>
    Backup
  </ActionButton>

  <ActionButton action={restore}>
    Restore
  </ActionButton>
</div>

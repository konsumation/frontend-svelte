<script>
  import { ActionButton } from "svelte-common";
  import { session } from "../main.mjs";
  import api from 'consts:api';

  async function backup() {
    await fetch(api + "/admin/backup", {
      headers: session.authorizationHeader
    });
  }

  async function restore() {
    await fetch(api + "/admin/restore", {
      method: "POST",
      headers: session.authorizationHeader
    });
  }
</script>

<div>
  <ActionButton action={backup}>Backup</ActionButton>

  <ActionButton action={restore}>Restore</ActionButton>
</div>

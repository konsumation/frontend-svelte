<script>
  import { ActionButton } from "svelte-common";
  import { session, headers } from "../util.mjs";
  import api from "consts:api";

  async function backup() {
    await fetch(api + "/admin/backup", {
      headers: headers(session)
    });
  }

  async function restore() {
    await fetch(api + "/admin/restore", {
      method: "POST",
      headers: headers(session)
    });
  }
</script>

<div>
  <ActionButton action={backup}>Backup</ActionButton>

  <ActionButton action={restore}>Restore</ActionButton>
</div>

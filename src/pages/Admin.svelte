<script>
  import { ActionButton } from "svelte-common";
  import { session, headers } from "../util.mjs";
  import api from "consts:api";

  let dump;

  async function backup() {
    const response = await fetch(api + "/admin/backup", {
      headers: headers(session)
    });

    dump = await response.text();
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

  <textarea bind:value={dump}></textarea>
</div>

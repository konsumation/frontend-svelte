<script>
  import streamSaver from "streamsaver";

  import { ActionButton } from "svelte-common";
  import { session, headers } from "../util.mjs";
  import api from "consts:api";
  let dump;

  async function backup() {
    const response = await fetch(api + "/admin/backup", {
      headers: headers(session)
    });

    try {
      const fileStream = streamSaver.createWriteStream("backup.txt");

      return response.body
        .pipeTo(fileStream)
        .then(() => console.log("done writing"));
    } catch (e) {
      console.log(e);
      dump = await response.text();
    }
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

  {#if dump !== undefined}<textarea bind:value={dump} />{/if}
</div>

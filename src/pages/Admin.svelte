<script>
  import streamSaver from "streamsaver";

  import { ActionButton, FetchAction } from "svelte-common";
  import { session, headers } from "../util.mjs";
  import api from "consts:api";
  let dump;

  function backupAction() {
    return new FetchAction(
      api + "/admin/backup",
      {
        headers: headers(session)
      },
      async response => {
        try {
          const fileStream = streamSaver.createWriteStream("backup.txt");

          return response.body.pipeTo(fileStream);
        } catch (e) {
          console.log(e);
          dump = await response.text();
        }
      }
    );
  }
</script>

<div>
  <ActionButton action={backupAction}>Backup</ActionButton>

  <ActionButton
    action={new FetchAction(api + '/admin/restore', {
      method: 'POST',
      headers: headers(session)
    })}>
    Restore
  </ActionButton>

  {#if dump !== undefined}<textarea bind:value={dump} />{/if}
</div>

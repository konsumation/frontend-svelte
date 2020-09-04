<script>
  import {
    DateTime,
    Duration,
    dateFormatter,
    formatDuration,
    formatBytes,
    About,
    SessionDetails
  } from "svelte-common";
  import { state } from "../main.mjs";
  import { session } from "../util.mjs";
  import name from "consts:name";
  import version from "consts:version";
  import description from "consts:description";
</script>

<About {name} {version} {description}>
  <tr>
    <td>Server Version</td>
    <td>{$state.version}</td>
  </tr>
  <tr>
    <td>Server Uptime</td>
    <td>
      <Duration seconds={$state.uptime} />
    </td>
  </tr>
  <tr>
    <td>Server Heap Total</td>
    <td>{formatBytes($state.memory.heapTotal)}</td>
  </tr>
  <tr>
    <td>Server Heap Used</td>
    <td>{formatBytes($state.memory.heapUsed)}</td>
  </tr>
  <SessionDetails session={$session} />
</About>

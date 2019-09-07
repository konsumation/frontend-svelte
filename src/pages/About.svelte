<script>
  import { name, version, description, config } from "../../package.json";
  import { state, session } from "../main.mjs";

  const dateFormatter = new Intl.DateTimeFormat("default", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric"
  });

  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";

    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const k = 1024;
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return (
      parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + " " + sizes[i]
    );
  }

  function formatDuration(seconds) {
    const durations = [
      [604800, "w"],
      [86400, "d"],
      [3600, "h"],
      [60, "m"],
      [1, "s"]
    ];

    let out = [];
    for (const d of durations) {
      const n = Math.floor(seconds / d[0]);
      if (n > 0) {
        out.push(`${n}${d[1]}`);
        seconds -= n * d[0];
      }
    }

    return out.join(" ");
  }
</script>

<div>
  <h2>{name}</h2>
  <p>{description}</p>
  <table class="bordered striped hoverable">
    <tbody>
      <tr>
        <td>Version</td>
        <td>{version}</td>
      </tr>
      <tr>
        <td>Server Version</td>
        <td>{$state.version}</td>
      </tr>
      <tr>
        <td>Server Uptime</td>
        <td>{formatDuration($state.uptime)}</td>
      </tr>
      <tr>
        <td>Server Heap Total</td>
        <td>{formatBytes($state.memory.heapTotal)}</td>
      </tr>
      <tr>
        <td>Server Heap Used</td>
        <td>{formatBytes($state.memory.heapUsed)}</td>
      </tr>
      <tr>
        <td>Mounted</td>
        <td>{config.urlPrefix}</td>
      </tr>
      <tr>
        <td>API</td>
        <td>{config.api}</td>
      </tr>
      <tr>
        <td>Username</td>
        <td>{$session.username}</td>
      </tr>
      <tr>
        <td>Session Expiration</td>
        <td class="{$session.isValid ? 'ok':'error'}">{dateFormatter.format($session.expirationDate)}</td>
      </tr>
      <tr>
        <td>Entitlements</td>
        <td>
          {#each [...$session.entitlements].sort() as name}
            <div>{name}</div>
          {/each}
        </td>
      </tr>
    </tbody>
  </table>
</div>

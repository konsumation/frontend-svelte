<script>
  import { dateFormatter, formatDuration, formatBytes } from "svelte-common";
  import { name, version, description, config } from "../../package.json";
  import { state, session } from "../main.mjs";
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
        <td>{config.base}</td>
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
        <td class={$session.isValid ? 'ok' : 'error'}>
          {dateFormatter.format($session.expirationDate)}
        </td>
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

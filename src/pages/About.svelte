<script>
  import { session } from "svelte-session-manager";
  import { name, version, description, config } from "../../package.json";
  import { state } from "../main.mjs";

  const dateFormatter = new Intl.DateTimeFormat("default", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric"
  });

/*
  let uptime;

  const durations = [[86400, "day"], [3600,"h"], [60, "min"], [1, 's']];

  $ : {
    let rest = $state.uptime;

    durations.reduce((a,c) => {
      if(c[0] > a) {
        const units = a / c[0];
      }
    }, $state.uptime);
  }
  */
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
        <td>{$state.uptime}</td>
      </tr>
      <tr>
        <td>Server Heap Total (Mb)</td>
        <td>{$state.memory.heapTotal / 1048576}</td>
      </tr>
      <tr>
        <td>Server Heap Used (Mb)</td>
        <td>{$state.memory.heapUsed / 1048576}</td>
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
        <td>Usrname</td>
        <td>{$session.username}</td>
      </tr>
      <tr>
        <td>Session Expiration</td>
        <td>{dateFormatter.format($session.expirationDate)}</td>
      </tr>
      {#each [...$session.entitlements] as name}
        <tr>
          <td>Entitlement</td>
          <td>{name}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

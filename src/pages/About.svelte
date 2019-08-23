<script>
  import { name, version, description, config } from "../../package.json";
  import { session } from "svelte-session-manager";

  const dateFormatter = new Intl.DateTimeFormat(/*{
    hour: "numeric",
    minute: "numeric",
    second: "numeric"
  }*/);
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

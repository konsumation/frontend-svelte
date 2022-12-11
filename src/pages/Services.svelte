<script>
  import {
    ServiceProvider,
    ServiceCanvas
  } from "@kronos-integration/svelte-components";
  import { websocketStore } from "svelte-websocket-store";
  import { session } from "../session.mjs";
  import { api_ws } from "../constants.mjs";

  const protocols = ["access_token", session.access_token];
  const services = new ServiceProvider(
    websocketStore(api_ws + "/admin/services", {}, protocols),
    websocketStore(api_ws + "/admin/requests", {}, protocols)
  );
</script>

<ServiceCanvas {services} />

<script>
  import {
    About,
    ApplicationDetails,
    SessionDetails,
    ServerDetails,
    ServiceWorkerDetails
  } from "svelte-common";
  import { server } from "../main.mjs";
  import { session } from "../util.mjs";
  import { serviceWorker } from "../main.mjs";
  import name from "consts:name";
  import version from "consts:version";
  import description from "consts:description";
</script>

<About>
  <ApplicationDetails {name} {version} {description} />
  <ServerDetails server={$server} />
  <SessionDetails session={$session} />
  <ServiceWorkerDetails serviceWorker={$serviceWorker} />
</About>

<script>
  import {
    About,
    ApplicationDetails,
    SessionDetails,
    ServerDetails,
    ServiceWorkerDetails,
    ServiceWorkerRegistrationDetails
  } from "svelte-common";
  import { server } from "../main.mjs";
  import { session } from "../util.mjs";
  import { serviceWorker, serviceWorkerRegistration } from "../main.mjs";
  import title from "consts:title";
  import version from "consts:version";
  import description from "consts:description";
</script>

<About>
  <ApplicationDetails name={title} {version} {description} />
  <ServerDetails server={$server} />
  <SessionDetails session={$session} />
  <ServiceWorkerDetails serviceWorker={$serviceWorker}  />
  <ServiceWorkerRegistrationDetails serviceWorkerRegistration={$serviceWorkerRegistration} />
</About>

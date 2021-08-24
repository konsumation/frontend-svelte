<script>
  import {
    About,
    ApplicationDetails,
    SessionDetails,
    ServerDetails,
    ServiceWorkerDetails,
    ServiceWorkerRegistrationDetails
  } from "svelte-common";
  import { server } from "../server.mjs";
  import { session } from "../util.mjs";
  import { serviceWorker, serviceWorkerRegistration } from "../service-worker/registration.mjs";
  import name from "vite";
  import version from "vite";
  import description from "vite";
</script>

<About>
  <ApplicationDetails {name} {version} {description} />
  <ServerDetails server={$server} />
  <SessionDetails session={$session} />
  <ServiceWorkerDetails serviceWorker={$serviceWorker}  />
  <ServiceWorkerRegistrationDetails serviceWorkerRegistration={$serviceWorkerRegistration} />
</About>

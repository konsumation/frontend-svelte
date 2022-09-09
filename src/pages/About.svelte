<script>
  import { server } from "../server.mjs";
  import {
    About,
    ApplicationDetails,
    SessionDetails,
    ServerDetails,
    ServiceWorkerDetails,
    ServiceWorkerRegistrationDetails
  } from "svelte-common";
  import { session } from "../util.mjs";

  /*
  import { serviceWorker, serviceWorkerRegistration } from "../service-worker/registration.mjs";
*/

  import { name, version, description } from "../constants.mjs";
</script>

<h1>About</h1>

<About>
  <ApplicationDetails {name} {version} {description} />
  <ServerDetails server={$server} />
  <SessionDetails session={$session} />
  <!--   <ServiceWorkerDetails serviceWorker={$serviceWorker}  />
  <ServiceWorkerRegistrationDetails serviceWorkerRegistration={$serviceWorkerRegistration} />-->
</About>

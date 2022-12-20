import { initializeServiceWorker } from "svelte-common";

const { serviceWorker, serviceWorkerRegistration } = initializeServiceWorker("bundle.service-worker.mjs");
export { serviceWorker, serviceWorkerRegistration };

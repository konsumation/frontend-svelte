import { mount } from 'svelte';
import App from "./App.svelte";

const app = mount(App, { target: document.body});

export default app;

const worker = new Worker(
  new URL("./service-worker/main.mjs", import.meta.url),
  { type: "module" }
);

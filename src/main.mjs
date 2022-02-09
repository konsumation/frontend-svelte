import App from "./App.svelte";

const worker = new Worker(
  new URL("./service-worker/main.mjs", import.meta.url),
  { type: "module" }
);

console.log(worker);

export default new App({
  target: document.body
});

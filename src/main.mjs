import {} from "./service-worker/registration.mjs";
import App from "./App.svelte";

export const now = readable(new Date(), set => {
  const interval = setInterval(() => set(new Date()), 1000);
  return () => clearInterval(interval);
});


export default new App({
  target: document.body
});

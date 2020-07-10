import { readable } from "svelte/store";
import { redirectGuard } from "svelte-guard-history-router";

import App from "./App.svelte";
import api from "consts:api";
import { session } from "./util.mjs";

export const enshureSession = redirectGuard("/login",() => !session.isValid);

export const state = readable(
  { version: "unknown", uptime: -1, memory: { heapTotal: 0, heapUsed: 0 } },
  set => {
    const f = async () => {
      const data = await fetch(api + "/state");
      set(await data.json());
    };

    f();

    const interval = setInterval(() => f(), 5000);

    return () => clearInterval(interval);
  }
);

export const now = readable(new Date(), set => {
  const interval = setInterval(() => set(new Date()), 1000);
  return () => clearInterval(interval);
});

export default new App({
  target: document.body
});

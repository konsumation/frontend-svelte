import { readable } from "svelte/store";
import { BaseRouter, Guard } from "svelte-guard-history-router";

import App from "./App.svelte";
import base from "consts:base";
import api from "consts:api";
import { session } from "./util.mjs";

class SessionGuard extends Guard {
  async enter(transition) {
    if (!session.isValid) {
      return transition.redirect("/login");
    }
  }
}

export const needsSession = new SessionGuard();

export const router = new BaseRouter(
  [],
  base
);

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

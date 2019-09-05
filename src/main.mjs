import { Router, route, NotFound } from "svelte-guard-history-router";
import { derived } from "svelte/store";
import { session } from "svelte-session-manager";

import Categories from "./pages/Categories.svelte";
import Category from "./pages/Category.svelte";
import Insert from "./pages/Insert.svelte";
import About from "./pages/About.svelte";
import Login from "./pages/Login.svelte";
import Home from "./pages/Home.svelte";
import App from "./App.svelte";
import { config } from "../package.json";

export const router = new Router(
  [
    route("*", NotFound),
    route("/*", Home),
    route("/login", Login),
    route("/about", About),
    route("/category", Categories),
    route("/category/:category", Category),
    route("/insert", Insert)
  ],
  config.urlPrefix
);

export const categories = derived(
  session,
  async ($session, set) => {
    const data = await fetch(config.api + "/categories", {
      headers: $session.authorizationHeader
    });
    set((await data.json()).map(c => new _Category(c, $session)));
    return () => {};
  },
  []
);

export class _Category {
  constructor(json, session) {
    Object.defineProperties(this, {
      session: { value: session },
      name: { value: json.name },
      unit: { value: json.unit },
      description: { value: json.description },
      _latestSubscriptions: { value: new Set() }
    });
  }

  async _latest() {
    const data = await fetch(
      config.api + `/category/${this.name}/values?reverse=1&limit=1`,
      {
        headers: {
          "content-type": "application/json",
          ...this.session.authorizationHeader
        }
      }
    );
    return (await data.json())[0];
  }

  get latest() {
    return {
      subscribe: subscription => {
        this._latestSubscriptions.add(subscription);
        subscription(0.0);
        this._latest().then(v =>
          this._latestSubscriptions.forEach(s => s(v.value))
        );

        return () => this._latestSubscriptions.delete(subscription);
      }
    };
  }

  async insert(value, time) {
    return fetch(config.api + `/category/${this.name}/insert`, {
      method: "POST",
      headers: this.session.authorizationHeader,
      body: JSON.stringify({ value, time })
    });
  }
}

export const category = derived(
  [categories, router.keys.category],
  ([$categories, $categoryKey], set) => {
    set($categories.find(a => a.name === $categoryKey));
    return () => {};
  }
);

export const values = derived(
  [session, category],
  async ([$session, $category], set) => {
    const c = $category;
    if (c === undefined) {
      set([]);
    } else {
      const data = await fetch(config.api + `/category/${c.name}/values`, {
        headers: {
          "content-type": "application/json",
          ...$session.authorizationHeader
        }
      });
      set(await data.json());
    }
    return () => {};
  }
);

export default new App({
  target: document.body
});

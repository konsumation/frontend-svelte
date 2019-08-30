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
  ($session, set) => {
    fetch(config.api + "/categories", {
      method: "GET",
      headers: $session.authorizationHeader
    }).then(async data => set(new _Category(await data.json())));
    return () => {};
  },
  []
);

export class _Category {
  constructor(json) {
    Object.defineProperties(this, {
      name: { value: json.name },
      unit: { value: json.unit },
      description: { value: json.description }
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

/*
export const latest = derived(
  categories,
  async ($categories, set) => {
    const data = await Promise.all($categories.map(c => 
    (await fetch(config.api + `/category/${c.name}/values?reverse&limit=1`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        ...$session.authorizationHeader
      }})).json()));

    const l = [{
      name: $categories[0].name,
      value: data[0][0].value
    }
    ];

    set(l);
    return () => {};
  }
);
*/

export const values = derived(
  [session, category],
  ([$session, $category], set) => {
    const c = $category;
    if (c === undefined) {
      set([]);
    } else {
      fetch(config.api + `/category/${c.name}/values`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
          ...$session.authorizationHeader
        }
      }).then(async data => set(await data.json()));
    }
    return () => {};
  }
);

export default new App({
  target: document.body
});

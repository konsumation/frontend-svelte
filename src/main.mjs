import { Router, route, NotFound } from "svelte-guard-history-router";
import { derived } from "svelte/store";
import { session } from "svelte-session-manager";

import Categories from "./pages/Categories.svelte";
import Category from "./pages/Category.svelte";
import About from "./pages/About.svelte";
import Login from "./pages/Login.svelte";
import Home from "./pages/Home.svelte";
import App from "./App.svelte";
import { config } from "../package.json";
import { categories } from "./store.mjs";


export const router = new Router(
  [
    route("*", NotFound),
    route("/index.html", Home),
    route("/*", Home),
    route("/login", Login),
    route("/about", About),
    route("/category", Categories),
    route("/category/:category", Category)
  ],
  config.urlPrefix
);

export const category = derived(
  [categories, router.keys.get("category")],
  ([$categories, $categoryKey], set) => {
    set($categories.find(a => a.name === $categoryKey));
    return () => {};
  }
);

export const values = derived(
  [session, category],
  ([$session, $category], set) => {
    fetch(config.api + `/category/${$category.name}/values`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        ...$session.authorizationHeader
      }
    }).then(async data => set(await data.json()));
    return () => {};
  }
);


export default new App({
  target: document.body
});

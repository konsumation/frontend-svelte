import { Router, route } from "svelte-guard-history-router";

import Categories from "./pages/Queues.svelte";
import Category from "./pages/Category.svelte";
import About from "./pages/About.svelte";
import Login from "./pages/Login.svelte";
import Home from "./pages/Home.svelte";
import NotFound from "./pages/NotFound.svelte";
import App from "./App.svelte";
import { config } from "../package.json";


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

export default new App({
  target: document.body
});

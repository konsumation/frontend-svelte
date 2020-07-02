import { readable } from "svelte/store";
import { BaseRouter, route, Guard } from "svelte-guard-history-router";

import CategoryValueList from "./pages/CategoryValueList.svelte";
import CategoryGraph from "./pages/CategoryGraph.svelte";
import Category from "./pages/Category.svelte";
import Categories from "./pages/Categories.svelte";
import CategoryLink from "./components/CategoryLink.svelte";
import App from "./App.svelte";
import base from "consts:base";
import api from "consts:api";
import { CategoryRoute, CategoriesRoute, ValuesRoute } from "./category.mjs";
import { session } from "./util.mjs";

class SessionGuard extends Guard {
  async enter(transition) {
    if (!session.isValid) {
      return transition.redirect("/login");
    }
  }
}

export const needsSession = new SessionGuard();

export const categoriesRoute = route("/category", CategoriesRoute, needsSession, Categories);

export const categoryRoute = route("/category/:category", CategoryRoute, needsSession, Category);
categoryRoute.linkComponent = CategoryLink;

export const valuesListRoute = route("/category/:category/values/list", ValuesRoute, needsSession, CategoryValueList);
export const valuesGraphRoute = route("/category/:category/values/graph", ValuesRoute, needsSession, CategoryGraph);

export const router = new BaseRouter(
  [
    categoriesRoute,
    categoryRoute,
    valuesListRoute,
    valuesGraphRoute
  ],
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

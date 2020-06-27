import { derived, readable } from "svelte/store";
import { BaseRouter, SkeletonRoute, route, Guard } from "svelte-guard-history-router";
import { Session } from "svelte-session-manager";

import CategoryValueList from "./pages/CategoryValueList.svelte";
import CategoryGraph from "./pages/CategoryGraph.svelte";
import Category from "./pages/Category.svelte";
import App from "./App.svelte";
import base from 'consts:base';
import api from 'consts:api';

export const session = new Session(localStorage);

class SessionGuard extends Guard {
  async enter(transition) {
    if (!session.isValid) {
      return transition.redirect("/login");
    }
  }
}

export const needsSession = new SessionGuard();

export const router = new BaseRouter(
  [
    route("/category/:category", SkeletonRoute, needsSession, Category),
    route("/category/:category/list", SkeletonRoute, needsSession, CategoryValueList),
    route("/category/:category/graph", SkeletonRoute, needsSession, CategoryGraph)
  ],
  base
);

export const categories = derived(
  session,
  ($session, set) => {
    if ($session.isValid) {
      fetch(api + "/categories", {
        headers: session.authorizationHeader
      }).then(async data =>
        set((await data.json()).map(c => new _Category(c)))
      );
    } else {
      set([]);
    }
    return () => {};
  },
  []
);


function headers(session) {
  return {
    "content-type": "application/json",
    ...session.authorizationHeader
  };
}

export class _Category {
  constructor(json) {
    this.unit = json.unit;
    this.description = json.description;
    this.order = json.order || 1.0;

    Object.defineProperties(this, {
      name: { value: json.name },
      /*
      unit: { value: json.unit },
      description: { value: json.description },
      */
      _latestSubscriptions: { value: new Set() },
      _valuesSubscriptions: { value: new Set() }
    });
  }

  async save() {
    return await fetch(api + `/category/${this.name}`, {
      method: "PUT",
      headers: headers(session),
      body: JSON.stringify({ order: this.order, unit: this.unit, description: this.description })
    });
  }

  async _latest() {
    const data = await fetch(
      api + `/category/${this.name}/values?reverse=1&limit=1`,
      {
        headers: headers(session)
      }
    );

    const entry = (await data.json())[0];
    this._latestSubscriptions.forEach(subscription => subscription(entry));
  }

  get latest() {
    return {
      subscribe: subscription => {
        this._latestSubscriptions.add(subscription);
        subscription(undefined);
        this._latest();
        return () => this._latestSubscriptions.delete(subscription);
      }
    };
  }

  async _values() {
    const data = await fetch(api + `/category/${this.name}/values`, {
      headers: headers(session)
    });

    const values = await data.json();
    this._valuesSubscriptions.forEach(subscription => subscription(values));
  }

  get values() {
    return {
      subscribe: subscription => {
        this._valuesSubscriptions.add(subscription);
        subscription([]);
        this._values();
        return () => this._valuesSubscriptions.delete(subscription);
      }
    };
  }

  async insert(value, time) {
    return fetch(api + `/category/${this.name}/insert`, {
      method: "POST",
      headers: headers(session),
      body: JSON.stringify({ value, time: time.getTime() })
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
  ([$session, $category], set) => {
    const c = $category;
    if (c === undefined || !session.isValid) {
      set([]);
    } else {
      fetch(api + `/category/${c.name}/values`, {
        headers: headers(session),
      }).then(async data => set(await data.json()));
    }
    return () => {};
  }
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

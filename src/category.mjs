import {
  IteratorStoreRoute
  
} from "svelte-guard-history-router";
import api from "consts:api";
import { session, headers } from "./util.mjs";

export class CategoriesRoute extends IteratorStoreRoute {
  async *iteratorFor() {
    if (this.categories) {
      yield* this.categories;
    } else {
      this.categories = [];

      const response = await fetch(`${api}/categories`, {
        headers: headers(session)
      });
      for (const c of await response.json()) {
        const category = new Category(c);
        this.categories.push(category);
        yield category;
      }
    }
  }
}

export class ValuesRoute extends IteratorStoreRoute {
  async *iteratorFor(properties) {
    const response = await fetch(
      `${api}/category/${properties.category}/values`,
      {
        headers: headers(session)
      }
    );
    for (const value of await response.json()) {
      yield value;
    }
  }

  propertiesFor() {
    return undefined;
  }
}

export class Category {
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
    return await fetch(`${api}/category/${this.name}`, {
      method: "PUT",
      headers: headers(session),
      body: JSON.stringify({
        order: this.order,
        unit: this.unit,
        description: this.description
      })
    });
  }

  async _latest() {
    const data = await fetch(
      `${api}/category/${this.name}/values?reverse=1&limit=1`,
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
    const data = await fetch(`${api}/category/${this.name}/values`, {
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
    return fetch(`${api}/category/${this.name}/insert`, {
      method: "POST",
      headers: headers(session),
      body: JSON.stringify({ value, time: time.getTime() })
    });
  }
}

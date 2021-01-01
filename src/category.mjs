import api from "consts:api";
import { session, headers } from "./util.mjs";

export async function* categoryIterator(transition) {
  if (this.categories) {
    yield* this.categories;
  } else {
    const categories = [];

    //this.categories = categories;
    //transition.context.categories = categories;

    const response = await fetch(`${api}/categories`, {
      headers: headers(session)
    });
    for (const c of await response.json()) {
      const category = new Category(c);
      categories.push(category);
      yield category;
    }
  }
}

export async function* valueIterator(transition) {
  const response = await fetch(
    `${api}/category/${transition.params.category}/values`,
    {
      headers: headers(session)
    }
  );
  for (const value of await response.json()) {
    yield value;
  }
}

export class Meter {
  constructor(category,json) {
    this.category = category;
    Object.assign(this, json);
  }
}

export class Note {
  constructor(category,json) {
    this.category = category;
    Object.assign(this, json);
  }
}

export class Category {
  constructor(json) {
    this.name = json.name;
    this.unit = json.unit;
    this.description = json.description;
    this.fractionalDigits = json.fractionalDigits || 2;
    this.order = json.order || 1.0;

    Object.defineProperties(this, {
      _latestSubscriptions: { value: new Set() },
      _valuesSubscriptions: { value: new Set() }
    });
  }

  async *meters() {
    const response = await fetch(`${api}/category/${this.name}/meters`, {
      headers: headers(session)
    });
    for (const item of await response.json()) {
      yield new Meter(this,item);
    }
  }

  async *notes() {
    const response = await fetch(`${api}/category/${this.name}/notes`, {
      headers: headers(session)
    });
    for (const item of await response.json()) {
      yield new Note(this,item);
    }
  }

  async delete() {
    return await fetch(`${api}/category/${this.name}`, {
      method: "DELETE",
      headers: headers(session)
    });
  }

  async save() {
    this.fractionalDigits = parseInt(this.fractionalDigits);
    const body = JSON.stringify({
      order: this.order,
      unit: this.unit,
      fractionalDigits: this.fractionalDigits,
      description: this.description
    });

    return await fetch(`${api}/category/${this.name}`, {
      method: "PUT",
      headers: headers(session),
      body
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

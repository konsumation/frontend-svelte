import { readable } from "svelte/store";
//import api from "vite";

export const server = readable(
  { database: {}, memory: {} },
  set => {

    const api = "XXX";
    const f = async () => {
      const data = await fetch(api + "/state");
      set(await data.json());
    };

    f();

    const interval = setInterval(() => f(), 5000);

    return () => clearInterval(interval);
  }
);

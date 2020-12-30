import { readable } from "svelte/store";
import api from "consts:api";

export const server = readable(
  { memory: {} },
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

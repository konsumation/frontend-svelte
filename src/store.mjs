import { readable } from "svelte/store";
import { config } from "../package.json";


export const categories = readable([], set => {
  fetch(config.api + "/categories").then(async data => set(await data.json()));
  return () => {
  };
});


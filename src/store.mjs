import { derived } from "svelte/store";
import { session } from "svelte-session-manager";
import { config } from "../package.json";

export const categories = derived(
  session,
  ($session, set) => {
    fetch(config.api + "/categories", {
      method: "GET",
      headers: $session.authorizationHeader
    }).then(async data => set(await data.json()));
    return () => {};
  },
  []
);


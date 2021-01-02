import { Session } from "svelte-session-manager";

export const session = new Session(localStorage);

export function headers(session) {
  return {
    "content-type": "application/json",
    ...session.authorizationHeader
  };
}

export function errorHandler(error) {
  alert(error);
}

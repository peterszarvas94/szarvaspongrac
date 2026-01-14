import htmx from "htmx.org";

import { pb } from "@scripts/db";

htmx.config.selfRequestsOnly = false;
htmx.config.withCredentials = false;

document.body.addEventListener("htmx:configRequest", (event) => {
  if (!pb.authStore.isValid) {
    return;
  }

  const requestEvent = event as CustomEvent<{
    headers: Record<string, string>;
  }>;
  requestEvent.detail.headers.Authorization = `Bearer ${pb.authStore.token}`;
});

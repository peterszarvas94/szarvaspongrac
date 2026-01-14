# HTMX + PocketBase Hooks

This project uses htmx for small HTML swaps while keeping PocketBase auth handled by the JS SDK.

## Hooks location

PocketBase loads hooks from `pb/pb_hooks/` next to the binary.

## Auth header for htmx

Htmx requests include the PocketBase auth token via the `htmx:configRequest` event in `src/scripts/htmx.ts`.

```ts
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
```

## Example hook: auth email

Hook route in `pb/pb_hooks/auth.pb.js`:

```js
routerAdd("get", "/partials/auth-email", (e) => {
  const email = e.auth?.email?.() ?? "";
  const html = $template
    .loadFiles(`${__hooks}/views/auth-email.html`)
    .render({ email });

  return e.html(200, html);
});
```

Template in `pb/pb_hooks/views/auth-email.html`:

```html
{{if .email}}{{.email}}{{end}}
```

## Example htmx usage

```astro
<p
  data-email
  class="text-lg mb-6"
  hx-get={`${import.meta.env.PUBLIC_PB_URL}/partials/auth-email`}
  hx-trigger="load, auth-updated from:body"
  hx-swap="innerHTML"
>
</p>
```

## Notes

- The PocketBase auth record exposes email via `e.auth.email()`.
- Cross-origin requests require `htmx.config.selfRequestsOnly = false`.

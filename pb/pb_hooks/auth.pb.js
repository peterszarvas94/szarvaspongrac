routerAdd("get", "/partials/auth-email", (e) => {
  const email = e.auth?.email?.() ?? "";
  const html = $template
    .loadFiles(`${__hooks}/views/auth-email.html`)
    .render({ email });

  return e.html(200, html);
});

routerAdd("get", "/partials/admin-auth-card", (e) => {
  const email = e.auth?.email?.() ?? "";
  const html = $template
    .loadFiles(`${__hooks}/views/admin-auth-card.html`)
    .render({ email });

  return e.html(200, html);
});

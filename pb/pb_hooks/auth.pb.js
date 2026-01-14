routerAdd("get", "/partials/auth-email", (e) => {
  const email = e.auth?.email?.() ?? "";
  const html = $template
    .loadFiles(`${__hooks}/views/auth-email.html`)
    .render({ email });

  return e.html(200, html);
});

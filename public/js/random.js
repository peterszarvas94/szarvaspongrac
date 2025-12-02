export function getRandomId(size = 21) {
  const alphabet =
    "useandom26T198340PX75pxJACKVERYMINDBUSHWOLFGQZbfghjklqvwyzrict";
  let id = "";
  const bytes = crypto.getRandomValues(new Uint8Array(size));
  for (let i = 0; i < size; i++) {
    id += alphabet[bytes[i] & 63];
  }
  return id;
}

import "datastar";
import { Editor, StarterKit, Strike } from "tiptap-bundle";

let editor = null;
let currentKey = null;

window.editor = null;

function keyId(key) {
  return key.replaceAll(".", "-");
}

window.mountEditor = (contentKey) => {
  window.destroyEditor();
  currentKey = contentKey;
  const wrap = document.getElementById("active-editor-wrap");
  const mount = document.getElementById("active-editor");
  const article = document.getElementById("content-" + keyId(contentKey));
  if (!wrap || !mount || !article) return;
  const html = article.querySelector(".prose")?.innerHTML || "";
  wrap.classList.remove("hidden");
  editor = new Editor({
    element: mount,
    extensions: [StarterKit.configure({ strike: false }), Strike],
    content: html,
    onUpdate: () => window.dispatchEvent(new CustomEvent("editorupdate")),
    onSelectionUpdate: () => window.dispatchEvent(new CustomEvent("editorupdate")),
  });
  window.editor = editor;
};

window.destroyEditor = () => {
  if (editor) {
    editor.destroy();
    editor = null;
    window.editor = null;
  }
  currentKey = null;
};

window.uploadEditorImage = async () => {
  if (!currentKey || !editor) return;
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.onchange = async () => {
    const file = input.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("key", currentKey);
    fd.append("file", file);
    const res = await fetch("/content-images", { method: "POST", body: fd });
    const data = await res.json();
    if (data.url) editor.chain().focus().setImage({ src: data.url }).run();
  };
  input.click();
};

let galleryUrls = [];
let galleryIndex = 0;

window.openGalleryImage = (url) => {
  galleryUrls = Array.from(document.querySelectorAll("#gallery-grid img")).map((img) => img.src);
  galleryIndex = galleryUrls.indexOf(url);
  const pop = document.getElementById("image-popover");
  const img = document.getElementById("popover-img");
  if (img) img.src = url;
  pop?.showPopover();
};

window.galleryPrev = () => {
  if (galleryIndex > 0) {
    galleryIndex--;
    const img = document.getElementById("popover-img");
    if (img) img.src = galleryUrls[galleryIndex];
  }
};

window.galleryNext = () => {
  if (galleryIndex < galleryUrls.length - 1) {
    galleryIndex++;
    const img = document.getElementById("popover-img");
    if (img) img.src = galleryUrls[galleryIndex];
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const region = document.getElementById("prose-edit-region");
  const wrap = document.getElementById("active-editor-wrap");
  const key = region?.dataset.contentKey;
  if (wrap && key) window.mountEditor(key);
});

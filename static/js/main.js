import "datastar";
import { Editor, StarterKit, Strike, Underline, TextAlign, Figure } from "tiptap-bundle";
import { bindImageUpload } from "szarvaspongrac/image-upload";

window.bindImageUpload = bindImageUpload;

let editor = null;
let currentKey = null;

window.editor = null;

const editorExtensions = [
  StarterKit.configure({ strike: false }),
  Strike,
  Underline,
  TextAlign.configure({ types: ["heading", "paragraph", "figure"] }),
  Figure,
];

function dispatchEditorUpdate() {
  window.dispatchEvent(new CustomEvent("editorupdate"));
}

function readInitialContent() {
  const initial = document.getElementById("editor-initial");
  return initial?.value || initial?.textContent || "";
}

window.mountEditor = (contentKey) => {
  if (editor && currentKey === contentKey) return;

  window.destroyEditor();

  const mount = document.getElementById("active-editor");
  if (!mount) return;

  editor = new Editor({
    element: mount,
    extensions: editorExtensions,
    content: "",
    onUpdate: dispatchEditorUpdate,
    onSelectionUpdate: dispatchEditorUpdate,
    onCreate: dispatchEditorUpdate,
  });

  window.editor = editor;
  currentKey = contentKey;
};

window.setEditorContent = (html) => {
  if (!editor || !html) return;
  editor.commands.setContent(html, { emitUpdate: false });
  dispatchEditorUpdate();
};

window.bootEditor = () => {
  const run = () => {
    const region = document.getElementById("prose-edit-region");
    const key = region?.dataset.contentKey;
    const html = readInitialContent();
    if (!key || !html) return false;

    window.mountEditor(key);
    window.setEditorContent(html);
    return true;
  };

  if (run()) return;
  requestAnimationFrame(() => run());
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

document.addEventListener("DOMContentLoaded", () => {
  window.bootEditor();
});

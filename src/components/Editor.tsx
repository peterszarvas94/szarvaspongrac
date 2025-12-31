import { createSignal, onMount, onCleanup, For } from "solid-js";
import { Editor as TipTap } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import ImageResize from "tiptap-extension-resize-image";
import { getContent, pb, getURLFromRecord } from "@lib/db";
import "@styles/tiptap.css";
import { toolbarActions } from "@lib/tiptap-setup";

interface Props {
  contentKey: string;
}

// TODO: make own resizable image component, which puts the image in a p, so align on p works. or make custom align if necessary. or if nothing works, forget image resize i guess...
export default function Editor(props: Props) {
  let editorElement: HTMLDivElement | undefined;
  let imageInputRef: HTMLInputElement | undefined;
  const [editor, setEditor] = createSignal<TipTap | null>(null);

  const [activeStates, setActiveStates] = createSignal<Record<string, boolean>>(
    {},
  );
  const [htmlContent, setHtmlContent] = createSignal("");

  const updateActiveStates = () => {
    const e = editor();
    if (!e) return;
    setActiveStates({
      bold: e.isActive("bold"),
      italic: e.isActive("italic"),
      strike: e.isActive("strike"),
      heading1: e.isActive("heading", { level: 1 }),
      heading2: e.isActive("heading", { level: 2 }),
      heading3: e.isActive("heading", { level: 3 }),
      paragraph: e.isActive("paragraph"),
      bulletList: e.isActive("bulletList"),
      orderedList: e.isActive("orderedList"),
      blockquote: e.isActive("blockquote"),
      alignLeft: e.isActive({ textAlign: "left" }),
      alignCenter: e.isActive({ textAlign: "center" }),
      alignRight: e.isActive({ textAlign: "right" }),
      alignJustify: e.isActive({ textAlign: "justify" }),
    });
  };

  const executeAction = (action: string) => {
    const e = editor();
    if (!e) return;
    switch (action) {
      case "bold":
        e.chain().focus().toggleBold().run();
        break;
      case "italic":
        e.chain().focus().toggleItalic().run();
        break;
      case "strike":
        e.chain().focus().toggleStrike().run();
        break;
      case "heading1":
        e.chain().focus().toggleHeading({ level: 1 }).run();
        break;
      case "heading2":
        e.chain().focus().toggleHeading({ level: 2 }).run();
        break;
      case "heading3":
        e.chain().focus().toggleHeading({ level: 3 }).run();
        break;
      case "paragraph":
        e.chain().focus().setParagraph().run();
        break;
      case "bulletList":
        e.chain().focus().toggleBulletList().run();
        break;
      case "orderedList":
        e.chain().focus().toggleOrderedList().run();
        break;
      case "blockquote":
        e.chain().focus().toggleBlockquote().run();
        break;
      case "alignLeft":
        e.chain().focus().setTextAlign("left").run();
        break;
      case "alignCenter":
        e.chain().focus().setTextAlign("center").run();
        break;
      case "alignRight":
        e.chain().focus().setTextAlign("right").run();
        break;
      case "alignJustify":
        e.chain().focus().setTextAlign("justify").run();
        break;
      case "image":
        imageInputRef?.click();
        break;
      case "undo":
        e.chain().focus().undo().run();
        break;
      case "redo":
        e.chain().focus().redo().run();
        break;
    }
    updateActiveStates();
  };

  const handleImageUpload = async (e: Event) => {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file || file.name === "") return;

    try {
      const record = await pb.collection("image").create({
        key: props.contentKey,
        file,
      });
      const url = getURLFromRecord(record);

      editor()?.chain().focus().setImage({ src: url }).run();
    } catch (err) {
      console.error("Image upload failed:", err);
      alert("Nem sikerült feltölteni a képet");
    }

    input.value = "";
  };

  onMount(async () => {
    if (!editorElement) return;
    const initialContent = await getContent(props.contentKey);

    const newEditor = new TipTap({
      element: editorElement,
      extensions: [
        StarterKit,
        Placeholder.configure({
          placeholder: "Kezdj el írni...",
        }),
        TextAlign.configure({
          types: ["heading", "paragraph", "resizableImage"],
        }),
        // Image,
        ImageResize,
        // ResizableImage,
      ],
      content: initialContent,
      onUpdate: ({ editor }) => {
        const html = editor.getHTML();
        setHtmlContent(html);
      },
      onSelectionUpdate: () => {
        updateActiveStates();
      },
    });

    setEditor(newEditor);
    updateActiveStates();
  });

  onCleanup(() => {
    editor()?.destroy();
  });

  return (
    <div class="tiptap-editor">
      <div class="tiptap-actionbar">
        <For each={toolbarActions}>
          {(item) =>
            item.action.startsWith("divider") ? (
              <div class="tiptap-divider" />
            ) : (
              <button
                type="button"
                class={`tiptap-button ${activeStates()[item.action] ? "tiptap-button-selected" : ""}`}
                title={item.title}
                onClick={() => executeAction(item.action)}
              >
                {item.icon()}
              </button>
            )
          }
        </For>
      </div>
      <div
        ref={editorElement}
        class="prose tiptap-content"
      />
      <input
        type="hidden"
        name={props.contentKey}
        value={htmlContent()}
      />
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        class="hidden"
        onChange={handleImageUpload}
      />
    </div>
  );
}

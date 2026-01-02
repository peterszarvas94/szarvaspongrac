import { createSignal, onMount, onCleanup, For } from "solid-js";
import { Editor as TipTap } from "@tiptap/core";
import { getContent, pb, getURLFromRecord } from "@lib/db";
import "@styles/tiptap.css";
import { toolbarActions, extensions } from "@lib/tiptap-setup";

interface Props {
  contentKey: string;
}

export default function Editor(props: Props) {
  let editorElement: HTMLDivElement | undefined;
  let imageInputRef: HTMLInputElement | undefined;
  const [editor, setEditor] = createSignal<TipTap | null>(null);
  const [htmlContent, setHtmlContent] = createSignal("");
  const [, forceUpdate] = createSignal(0);

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
      extensions,
      content: initialContent,
      onUpdate: ({ editor }) => {
        setHtmlContent(editor.getHTML());
      },
      onSelectionUpdate: () => {
        forceUpdate((n) => n + 1);
      },
    });

    setEditor(newEditor);
  });

  const handleEditModeChange = async () => {
    const isEditMode = localStorage.getItem("editMode") === "true";
    const freshContent = await getContent(props.contentKey);
    editor()?.commands.setContent(freshContent);
    setHtmlContent(freshContent);
  };

  onMount(() => {
    window.addEventListener("editModeChanged", handleEditModeChange);

    onCleanup(() => {
      window.removeEventListener("editModeChanged", handleEditModeChange);
    });
  });

  onCleanup(() => {
    editor()?.destroy();
  });

  return (
    <div class="tiptap-editor">
      <div class="tiptap-actionbar">
        <For each={toolbarActions}>
          {(item) => {
            if (item.type === "divider") {
              return <div class="tiptap-divider" />;
            }
            const e = editor();
            const isActive = e && item.isActive?.(e);
            return (
              <button
                type="button"
                class={`tiptap-button ${isActive ? "tiptap-button-selected" : ""}`}
                title={item.title}
                onClick={() => {
                  const ed = editor();
                  if (!ed) return;
                  if (item.key === "image") {
                    imageInputRef?.click();
                  } else {
                    item.run(ed);
                  }
                  forceUpdate((n) => n + 1);
                }}
              >
                {item.icon()}
              </button>
            );
          }}
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

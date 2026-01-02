import { createSignal, onMount, onCleanup, For, Show } from "solid-js";
import { Editor as TipTap } from "@tiptap/core";
import { getContent, pb, getURLFromRecord } from "@scripts/db";
import "@styles/tiptap.css";
import { toolbarActions, extensions } from "@scripts/tiptap-setup";
import { EditModeEvent, getEditModeLS } from "@scripts/edit";
import { showAlert } from "@scripts/toaster";

interface Props {
  contentKey: string;
}

export default function Editor(props: Props) {
  const [isEditMode, setIsEditMode] = createSignal(getEditModeLS());

  const handleEditModeChange = (event: EditModeEvent) => {
    setIsEditMode(event.detail.editMode);
  };

  onMount(() => {
    window.addEventListener(
      EditModeEvent.eventName,
      handleEditModeChange as EventListener,
    );

    onCleanup(() => {
      window.removeEventListener(
        EditModeEvent.eventName,
        handleEditModeChange as EventListener,
      );
    });
  });

  return (
    <Show when={isEditMode()}>
      <EditorInner {...props} />
    </Show>
  );
}

function EditorInner(props: Props) {
  let editorElement: HTMLDivElement | undefined;
  let imageInputRef: HTMLInputElement | undefined;
  const [editor, setEditor] = createSignal<TipTap | null>(null);
  const [htmlContent, setHtmlContent] = createSignal("");

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
      showAlert("Nem sikerült feltölteni a képet", "error");
    }

    input.value = "";
  };

  onMount(async () => {
    if (!editorElement) return;
    const initialContent = await getContent(props.contentKey);
    setHtmlContent(initialContent);

    const newEditor = new TipTap({
      element: editorElement,
      extensions,
      content: initialContent,
      onUpdate: ({ editor }) => {
        setHtmlContent(editor.getHTML());
      },
    });

    setEditor(newEditor);
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

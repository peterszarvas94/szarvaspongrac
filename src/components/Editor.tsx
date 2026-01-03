import { createSignal, onMount, onCleanup, For, Show } from "solid-js";
import { Editor as TipTap } from "@tiptap/core";
import { pb, getURLFromRecord } from "@scripts/db";
import { getCachedContent } from "@scripts/content-manager";
import "@styles/tiptap.css";
import { toolbarActions, extensions } from "@scripts/tiptap-setup";
import { getEditMode, EditModeEvent } from "@scripts/edit";
import { showAlert } from "@scripts/toaster";

interface EditorProps {
  contentKey: string;
}

export default function Editor(props: EditorProps) {
  const [isEditMode, setIsEditMode] = createSignal(getEditMode());
  const [content, setContent] = createSignal<string | undefined>(undefined);

  const handleEditModeChange = (event: EditModeEvent) => {
    setIsEditMode(event.detail.editMode);
    // Get content from cache when entering edit mode
    if (event.detail.editMode) {
      setContent(getCachedContent(props.contentKey));
    }
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
    <Show when={isEditMode() && content()}>
      <EditorInner
        contentKey={props.contentKey}
        initialContent={content()!}
      />
    </Show>
  );
}

function EditorInner(props: EditorProps & { initialContent: string }) {
  let editorElement: HTMLDivElement | undefined;
  let imageInputRef: HTMLInputElement | undefined;

  const [editor, setEditor] = createSignal<TipTap | null>(null);
  const [htmlContent, setHtmlContent] = createSignal(props.initialContent);

  const handleImageUpload = async (e: Event) => {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    try {
      const record = await pb.collection("image").create({
        key: props.contentKey,
        file,
      });
      const url = getURLFromRecord(record);
      editor()?.chain().focus().setImage({ src: url }).run();
    } catch {
      showAlert("Nem sikerült feltölteni a képet", "error");
    }

    input.value = "";
  };

  onMount(() => {
    const ed = new TipTap({
      element: editorElement!,
      extensions,
      content: props.initialContent,
      onUpdate: ({ editor }) => {
        setHtmlContent(editor.getHTML());
      },
    });

    setEditor(ed);
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

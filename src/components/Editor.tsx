import { createSignal, onMount, onCleanup, For, type JSX } from "solid-js";
import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  Pilcrow,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  TextAlignStart,
  TextAlignCenter,
  TextAlignEnd,
  TextAlignJustify,
  ImageIcon,
} from "lucide-solid";

interface EditorProps {
  key: string;
}

interface ToolbarAction {
  action: string;
  icon: () => JSX.Element;
  title: string;
}

const iconProps = { size: 16 };

const toolbarActions: ToolbarAction[] = [
  { action: "bold", icon: () => <Bold {...iconProps} />, title: "Bold" },
  { action: "italic", icon: () => <Italic {...iconProps} />, title: "Italic" },
  {
    action: "strike",
    icon: () => <Strikethrough {...iconProps} />,
    title: "Strikethrough",
  },
  { action: "divider1", icon: () => <></>, title: "" },
  {
    action: "heading1",
    icon: () => <Heading1 {...iconProps} />,
    title: "Heading 1",
  },
  {
    action: "heading2",
    icon: () => <Heading2 {...iconProps} />,
    title: "Heading 2",
  },
  {
    action: "heading3",
    icon: () => <Heading3 {...iconProps} />,
    title: "Heading 3",
  },
  {
    action: "paragraph",
    icon: () => <Pilcrow {...iconProps} />,
    title: "Paragraph",
  },
  { action: "divider2", icon: () => <></>, title: "" },
  {
    action: "bulletList",
    icon: () => <List {...iconProps} />,
    title: "Bullet List",
  },
  {
    action: "orderedList",
    icon: () => <ListOrdered {...iconProps} />,
    title: "Numbered List",
  },
  {
    action: "blockquote",
    icon: () => <Quote {...iconProps} />,
    title: "Blockquote",
  },
  { action: "divider3", icon: () => <></>, title: "" },
  {
    action: "alignLeft",
    icon: () => <TextAlignStart {...iconProps} />,
    title: "Align Left",
  },
  {
    action: "alignCenter",
    icon: () => <TextAlignCenter {...iconProps} />,
    title: "Align Center",
  },
  {
    action: "alignRight",
    icon: () => <TextAlignEnd {...iconProps} />,
    title: "Align Right",
  },
  {
    action: "alignJustify",
    icon: () => <TextAlignJustify {...iconProps} />,
    title: "Justify",
  },
  { action: "divider4", icon: () => <></>, title: "" },
  {
    action: "image",
    icon: () => <ImageIcon {...iconProps} />,
    title: "Insert Image",
  },
  { action: "divider5", icon: () => <></>, title: "" },
  { action: "undo", icon: () => <Undo {...iconProps} />, title: "Undo" },
  { action: "redo", icon: () => <Redo {...iconProps} />, title: "Redo" },
];

export default function TiptapEditor(props: EditorProps) {
  let editorElement: HTMLDivElement | undefined;
  const [editor, setEditor] = createSignal<Editor | null>(null);

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
        const url = prompt("Enter image URL:");
        if (url) {
          e.chain().focus().setImage({ src: url }).run();
        }
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

  onMount(() => {
    if (!editorElement) return;

    const newEditor = new Editor({
      element: editorElement,
      extensions: [
        StarterKit,
        Placeholder.configure({
          placeholder: "Start writing...",
        }),
        TextAlign.configure({
          types: ["heading", "paragraph"],
        }),
        Image.configure({
          inline: false,
          allowBase64: true,
        }),
      ],
      content: "",
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
        name={props.key}
        value={htmlContent()}
      />
    </div>
  );
}

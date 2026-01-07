import { Figure } from "@scripts/tiptap-figure";
import type { Editor } from "@tiptap/core";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Heading1,
  Heading2,
  Heading3,
  ImageIcon,
  Italic,
  List,
  ListOrdered,
  Pilcrow,
  Quote,
  Redo,
  Strikethrough,
  TextAlignCenter,
  TextAlignEnd,
  TextAlignJustify,
  TextAlignStart,
  Undo,
} from "lucide-solid";
import type { JSX } from "solid-js";

type ToolbarAction =
  | {
      type: "button";
      key: string;
      icon: () => JSX.Element;
      title: string;
      run: (editor: Editor) => void;
      isActive?: (editor: Editor) => boolean;
    }
  | { type: "divider" };

const iconProps = { size: 16 };

export const extensions = [
  StarterKit,
  Placeholder.configure({
    placeholder: "Kezdj el írni...",
  }),
  TextAlign.configure({
    types: ["heading", "paragraph", "figure"],
  }),
  Figure,
];

export const toolbarActions: ToolbarAction[] = [
  {
    type: "button",
    key: "bold",
    icon: () => <Bold {...iconProps} />,
    title: "Félkövér",
    run: (e) => e.chain().focus().toggleBold().run(),
    isActive: (e) => e.isActive("bold"),
  },
  {
    type: "button",
    key: "italic",
    icon: () => <Italic {...iconProps} />,
    title: "Dőlt",
    run: (e) => e.chain().focus().toggleItalic().run(),
    isActive: (e) => e.isActive("italic"),
  },
  {
    type: "button",
    key: "strike",
    icon: () => <Strikethrough {...iconProps} />,
    title: "Áthúzott",
    run: (e) => e.chain().focus().toggleStrike().run(),
    isActive: (e) => e.isActive("strike"),
  },
  { type: "divider" },
  {
    type: "button",
    key: "heading1",
    icon: () => <Heading1 {...iconProps} />,
    title: "Címsor 1",
    run: (e) => e.chain().focus().toggleHeading({ level: 1 }).run(),
    isActive: (e) => e.isActive("heading", { level: 1 }),
  },
  {
    type: "button",
    key: "heading2",
    icon: () => <Heading2 {...iconProps} />,
    title: "Címsor 2",
    run: (e) => e.chain().focus().toggleHeading({ level: 2 }).run(),
    isActive: (e) => e.isActive("heading", { level: 2 }),
  },
  {
    type: "button",
    key: "heading3",
    icon: () => <Heading3 {...iconProps} />,
    title: "Címsor 3",
    run: (e) => e.chain().focus().toggleHeading({ level: 3 }).run(),
    isActive: (e) => e.isActive("heading", { level: 3 }),
  },
  {
    type: "button",
    key: "paragraph",
    icon: () => <Pilcrow {...iconProps} />,
    title: "Bekezdés",
    run: (e) => e.chain().focus().setParagraph().run(),
    isActive: (e) => e.isActive("paragraph"),
  },
  { type: "divider" },
  {
    type: "button",
    key: "bulletList",
    icon: () => <List {...iconProps} />,
    title: "Felsorolás",
    run: (e) => e.chain().focus().toggleBulletList().run(),
    isActive: (e) => e.isActive("bulletList"),
  },
  {
    type: "button",
    key: "orderedList",
    icon: () => <ListOrdered {...iconProps} />,
    title: "Számozott lista",
    run: (e) => e.chain().focus().toggleOrderedList().run(),
    isActive: (e) => e.isActive("orderedList"),
  },
  {
    type: "button",
    key: "blockquote",
    icon: () => <Quote {...iconProps} />,
    title: "Idézet",
    run: (e) => e.chain().focus().toggleBlockquote().run(),
    isActive: (e) => e.isActive("blockquote"),
  },
  { type: "divider" },
  {
    type: "button",
    key: "alignLeft",
    icon: () => <TextAlignStart {...iconProps} />,
    title: "Balra igazítás",
    run: (e) => e.chain().focus().setTextAlign("left").run(),
    isActive: (e) => e.isActive({ textAlign: "left" }),
  },
  {
    type: "button",
    key: "alignCenter",
    icon: () => <TextAlignCenter {...iconProps} />,
    title: "Középre igazítás",
    run: (e) => e.chain().focus().setTextAlign("center").run(),
    isActive: (e) => e.isActive({ textAlign: "center" }),
  },
  {
    type: "button",
    key: "alignRight",
    icon: () => <TextAlignEnd {...iconProps} />,
    title: "Jobbra igazítás",
    run: (e) => e.chain().focus().setTextAlign("right").run(),
    isActive: (e) => e.isActive({ textAlign: "right" }),
  },
  {
    type: "button",
    key: "alignJustify",
    icon: () => <TextAlignJustify {...iconProps} />,
    title: "Sorkizárt",
    run: (e) => e.chain().focus().setTextAlign("justify").run(),
    isActive: (e) => e.isActive({ textAlign: "justify" }),
  },
  { type: "divider" },
  {
    type: "button",
    key: "image",
    icon: () => <ImageIcon {...iconProps} />,
    title: "Kép",
    run: () => {}, // handled in Editor component
  },
  { type: "divider" },
  {
    type: "button",
    key: "undo",
    icon: () => <Undo {...iconProps} />,
    title: "Visszavonás",
    run: (e) => e.chain().focus().undo().run(),
  },
  {
    type: "button",
    key: "redo",
    icon: () => <Redo {...iconProps} />,
    title: "Újra",
    run: (e) => e.chain().focus().redo().run(),
  },
];

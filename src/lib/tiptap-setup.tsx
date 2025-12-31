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
import type { JSX } from "solid-js";

interface ToolbarAction {
  action: string;
  icon: () => JSX.Element;
  title: string;
}

export const iconProps = { size: 16 };

export const toolbarActions: ToolbarAction[] = [
  { action: "bold", icon: () => <Bold {...iconProps} />, title: "Félkövér" },
  { action: "italic", icon: () => <Italic {...iconProps} />, title: "Dőlt" },
  {
    action: "strike",
    icon: () => <Strikethrough {...iconProps} />,
    title: "Áthúzott",
  },
  { action: "divider1", icon: () => <></>, title: "" },
  {
    action: "heading1",
    icon: () => <Heading1 {...iconProps} />,
    title: "Címsor 1",
  },
  {
    action: "heading2",
    icon: () => <Heading2 {...iconProps} />,
    title: "Címsor 2",
  },
  {
    action: "heading3",
    icon: () => <Heading3 {...iconProps} />,
    title: "Címsor 3",
  },
  {
    action: "paragraph",
    icon: () => <Pilcrow {...iconProps} />,
    title: "Bekezdés",
  },
  { action: "divider2", icon: () => <></>, title: "" },
  {
    action: "bulletList",
    icon: () => <List {...iconProps} />,
    title: "Felsorolás",
  },
  {
    action: "orderedList",
    icon: () => <ListOrdered {...iconProps} />,
    title: "Számozott lista",
  },
  {
    action: "blockquote",
    icon: () => <Quote {...iconProps} />,
    title: "Idézet",
  },
  { action: "divider3", icon: () => <></>, title: "" },
  {
    action: "alignLeft",
    icon: () => <TextAlignStart {...iconProps} />,
    title: "Balra igazítás",
  },
  {
    action: "alignCenter",
    icon: () => <TextAlignCenter {...iconProps} />,
    title: "Középre igazítás",
  },
  {
    action: "alignRight",
    icon: () => <TextAlignEnd {...iconProps} />,
    title: "Jobbra igazítás",
  },
  {
    action: "alignJustify",
    icon: () => <TextAlignJustify {...iconProps} />,
    title: "Sorkizárt",
  },
  { action: "divider4", icon: () => <></>, title: "" },
  {
    action: "image",
    icon: () => <ImageIcon {...iconProps} />,
    title: "Kép",
  },
  { action: "divider5", icon: () => <></>, title: "" },
  { action: "undo", icon: () => <Undo {...iconProps} />, title: "Visszavonás" },
  { action: "redo", icon: () => <Redo {...iconProps} />, title: "Újra" },
];

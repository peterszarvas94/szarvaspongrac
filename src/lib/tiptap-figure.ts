import { mergeAttributes, Node, nodeInputRule } from "@tiptap/core";
import { Plugin } from "@tiptap/pm/state";

export interface FigureOptions {
  allowBase64: boolean;
  HTMLAttributes: Record<string, unknown>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    figure: {
      setImage: (options: {
        src: string;
        alt?: string;
        title?: string;
        width?: number;
      }) => ReturnType;
    };
  }
}

const inputRegex = /(?:^|\s)(!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\))$/;

const resizePlugin = new Plugin({
  view(editorView) {
    let activeImg: HTMLImageElement | null = null;
    let startX = 0;
    let startWidth = 0;
    let figureNode: HTMLElement | null = null;

    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 2) return;

      const target = e.target as HTMLElement;
      if (target.tagName !== "IMG") return;

      e.preventDefault();
      activeImg = target as HTMLImageElement;
      figureNode = target.closest("figure");
      startX = e.clientX;
      startWidth = activeImg.offsetWidth;

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
      document.addEventListener("contextmenu", preventContextMenu);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!activeImg) return;
      const delta = e.clientX - startX;
      const newWidth = Math.max(50, startWidth + delta);
      activeImg.setAttribute("width", String(newWidth));
      activeImg.classList.add("resizing");
    };

    const onMouseUp = () => {
      if (activeImg && figureNode) {
        activeImg.classList.remove("resizing");
        const pos = editorView.posAtDOM(figureNode, 0);
        if (pos !== null) {
          const newWidth = parseInt(activeImg.getAttribute("width") || "0", 10);
          const node = editorView.state.doc.nodeAt(pos);
          if (node) {
            editorView.dispatch(
              editorView.state.tr.setNodeMarkup(pos, null, {
                ...node.attrs,
                width: newWidth,
              }),
            );
          }
        }
      }
      activeImg = null;
      figureNode = null;
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      setTimeout(() => {
        document.removeEventListener("contextmenu", preventContextMenu);
      }, 100);
    };

    const preventContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    document.addEventListener("mousedown", onMouseDown);

    return {
      destroy() {
        document.removeEventListener("mousedown", onMouseDown);
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        document.removeEventListener("contextmenu", preventContextMenu);
      },
    };
  },
});

export const Figure = Node.create<FigureOptions>({
  name: "figure",

  addOptions() {
    return {
      allowBase64: false,
      HTMLAttributes: {},
    };
  },

  group: "block",

  selectable: true,

  addAttributes() {
    return {
      src: { default: null },
      alt: { default: null },
      title: { default: null },
      width: { default: null },
      textAlign: { default: null },
    };
  },

  parseHTML() {
    return [
      {
        tag: "figure",
        getAttrs: (node) => {
          const figure = node as HTMLElement;
          const img = figure.querySelector("img");
          if (!img) return false;

          const style = figure.getAttribute("style") || "";
          const alignMatch = style.match(/text-align:\s*(left|center|right)/);

          return {
            src: img.getAttribute("src"),
            alt: img.getAttribute("alt"),
            title: img.getAttribute("title"),
            width: img.getAttribute("width"),
            textAlign: alignMatch ? alignMatch[1] : null,
          };
        },
      },
      {
        tag: this.options.allowBase64
          ? "img[src]"
          : 'img[src]:not([src^="data:"])',
        getAttrs: (node) => {
          const img = node as HTMLImageElement;
          return {
            src: img.getAttribute("src"),
            alt: img.getAttribute("alt"),
            title: img.getAttribute("title"),
            width: img.getAttribute("width"),
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const { textAlign, ...imgAttrs } = HTMLAttributes;

    const figureAttrs: Record<string, string> = {};
    if (textAlign) {
      figureAttrs.style = `text-align: ${textAlign}`;
    }

    return [
      "figure",
      mergeAttributes(this.options.HTMLAttributes, figureAttrs),
      ["img", imgAttrs],
    ];
  },

  addCommands() {
    return {
      setImage:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },

  addInputRules() {
    return [
      nodeInputRule({
        find: inputRegex,
        type: this.type,
        getAttributes: (match) => {
          const [, , alt, src, title] = match;
          return { src, alt, title };
        },
      }),
    ];
  },

  addProseMirrorPlugins() {
    return [resizePlugin];
  },
});

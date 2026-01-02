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
  props: {
    handleDOMEvents: {
      mousedown(view, event) {
        if (event.button !== 2) return false;

        const target = event.target as HTMLElement;
        const figureNode = target.closest("figure");
        if (!figureNode || target.tagName !== "IMG") return false;

        // Check if we're in edit mode
        const isEditMode = localStorage.getItem("editMode") === "true";
        if (!isEditMode) return false;

        event.preventDefault();

        const img = target as HTMLImageElement;
        const startX = event.clientX;
        const startWidth = img.offsetWidth;

        const onMouseMove = (e: MouseEvent) => {
          const delta = e.clientX - startX;
          const newWidth = Math.max(50, startWidth + delta);
          img.setAttribute("width", String(newWidth));
          img.classList.add("resizing");
        };

        const preventContextMenu = (e: MouseEvent) => {
          e.preventDefault();
        };

        const onMouseUp = () => {
          img.classList.remove("resizing");
          const pos = view.posAtDOM(figureNode, 0);
          if (pos !== null) {
            const newWidth = parseInt(img.getAttribute("width") || "0", 10);
            const node = view.state.doc.nodeAt(pos);
            if (node) {
              view.dispatch(
                view.state.tr.setNodeMarkup(pos, null, {
                  ...node.attrs,
                  width: newWidth,
                }),
              );
            }
          }
          figureNode.removeEventListener("mousemove", onMouseMove);
          figureNode.removeEventListener("mouseup", onMouseUp);
          figureNode.removeEventListener("contextmenu", preventContextMenu);
        };

        // Attach event listeners to the figure element, not document
        figureNode.addEventListener("mousemove", onMouseMove);
        figureNode.addEventListener("mouseup", onMouseUp);
        figureNode.addEventListener("contextmenu", preventContextMenu);

        return true;
      },
    },
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

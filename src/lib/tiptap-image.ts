import { Node, mergeAttributes } from "@tiptap/core";

export interface ResizableImageOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    resizableImage: {
      setImage: (options: {
        src: string;
        alt?: string;
        width?: number;
      }) => ReturnType;
    };
  }
}

export const ResizableImage = Node.create<ResizableImageOptions>({
  name: "resizableImage",

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  group: "block",

  draggable: true,

  atom: true,

  isolating: true,

  inline: false,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      width: {
        default: null,
        parseHTML: (element) => {
          const width = element.getAttribute("width");
          return width ? parseInt(width, 10) : null;
        },
        renderHTML: (attributes) => {
          if (!attributes.width) return {};
          return { width: attributes.width };
        },
      },
      style: {
        default: null,
        parseHTML: (element) => element.getAttribute("style"),
        renderHTML: (attributes) => {
          if (!attributes.style) return {};
          return { style: attributes.style };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "img[src]",
        getAttrs: (node) => {
          const img = node as HTMLElement;
          return {
            src: img.getAttribute("src"),
            alt: img.getAttribute("alt"),
            width: img.getAttribute("width")
              ? parseInt(img.getAttribute("width")!)
              : null,
            style: img.getAttribute("style"),
          };
        },
      },
      {
        tag: "p img[src]",
        getAttrs: (node) => {
          const img = node as HTMLElement;
          return {
            src: img.getAttribute("src"),
            alt: img.getAttribute("alt"),
            width: img.getAttribute("width")
              ? parseInt(img.getAttribute("width")!)
              : null,
            style: img.getAttribute("style"),
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "img",
      mergeAttributes(HTMLAttributes, {
        class: "tiptap-resizable-image",
      }),
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

  addNodeView() {
    return ({ node, getPos, editor }) => {
      const img = document.createElement("img");
      img.src = node.attrs.src;
      img.alt = node.attrs.alt || "";
      img.classList.add("tiptap-resizable-image");
      if (node.attrs.width) {
        img.width = node.attrs.width;
      }
      if (node.attrs.style) {
        img.setAttribute("style", node.attrs.style);
      }

      let isResizing = false;
      let startX = 0;
      let startWidth = 0;

      const onContextMenu = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        isResizing = true;
        startX = e.clientX;
        startWidth = img.offsetWidth;
        img.classList.add("resizing");
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
      };

      const onMouseMove = (e: MouseEvent) => {
        if (!isResizing) return;
        const diff = e.clientX - startX;
        const newWidth = Math.max(50, startWidth + diff);
        img.width = newWidth;
      };

      const onMouseUp = () => {
        if (!isResizing) return;
        isResizing = false;
        img.classList.remove("resizing");
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);

        const pos = getPos();
        if (typeof pos === "number") {
          editor.view.dispatch(
            editor.view.state.tr.setNodeMarkup(pos, undefined, {
              ...node.attrs,
              width: img.width,
            }),
          );
        }
      };

      img.addEventListener("contextmenu", onContextMenu);

      return {
        dom: img,
        destroy() {
          img.removeEventListener("contextmenu", onContextMenu);
          document.removeEventListener("mousemove", onMouseMove);
          document.removeEventListener("mouseup", onMouseUp);
        },
        update(updatedNode) {
          if (updatedNode.type.name !== "resizableImage") return false;
          img.src = updatedNode.attrs.src;
          img.alt = updatedNode.attrs.alt || "";
          if (updatedNode.attrs.width) {
            img.width = updatedNode.attrs.width;
          }
          if (updatedNode.attrs.style) {
            img.setAttribute("style", updatedNode.attrs.style);
          }
          return true;
        },
      };
    };
  },
});

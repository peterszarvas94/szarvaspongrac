import { Node, mergeAttributes } from "@tiptap/core";

export interface FigureOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    figure: {
      setFigure: (options: {
        src: string;
        alt?: string;
        caption?: string;
        width?: number;
        height?: number;
      }) => ReturnType;
    };
  }
}

export const Figure = Node.create<FigureOptions>({
  name: "figure",

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  group: "block",

  content: "inline*",

  draggable: true,

  isolating: true,

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
      },
      height: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "figure",
        getAttrs: (node) => {
          const img = (node as HTMLElement).querySelector("img");
          return {
            src: img?.getAttribute("src"),
            alt: img?.getAttribute("alt"),
            width: img?.getAttribute("width")
              ? parseInt(img.getAttribute("width")!)
              : null,
            height: img?.getAttribute("height")
              ? parseInt(img.getAttribute("height")!)
              : null,
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const imgAttrs: Record<string, unknown> = {
      src: HTMLAttributes.src,
      alt: HTMLAttributes.alt,
      draggable: false,
      contenteditable: false,
    };

    if (HTMLAttributes.width) {
      imgAttrs.width = HTMLAttributes.width;
    }
    if (HTMLAttributes.height) {
      imgAttrs.height = HTMLAttributes.height;
    }

    return [
      "figure",
      mergeAttributes(this.options.HTMLAttributes, { class: "tiptap-figure" }),
      ["img", imgAttrs],
      ["figcaption", 0],
    ];
  },

  addNodeView() {
    return ({ node, getPos, editor }) => {
      const figure = document.createElement("figure");
      figure.classList.add("tiptap-figure");

      const img = document.createElement("img");
      img.src = node.attrs.src;
      img.alt = node.attrs.alt || "";
      img.draggable = false;

      if (node.attrs.width) {
        img.style.width = `${node.attrs.width}px`;
      }
      if (node.attrs.height) {
        img.style.height = `${node.attrs.height}px`;
      }

      const figcaption = document.createElement("figcaption");

      figure.appendChild(img);
      figure.appendChild(figcaption);

      const handleMouseUp = () => {
        const newWidth = Math.round(img.offsetWidth);
        const newHeight = Math.round(img.offsetHeight);

        if (typeof getPos === "function") {
          editor.commands.command(({ tr }) => {
            const pos = getPos();
            if (pos === undefined) return false;
            tr.setNodeMarkup(pos, undefined, {
              ...node.attrs,
              width: newWidth,
              height: newHeight,
            });
            return true;
          });
        }
      };

      img.addEventListener("mouseup", handleMouseUp);

      return {
        dom: figure,
        contentDOM: figcaption,
        destroy() {
          img.removeEventListener("mouseup", handleMouseUp);
        },
        update(updatedNode) {
          if (updatedNode.type.name !== "figure") return false;

          img.src = updatedNode.attrs.src;
          img.alt = updatedNode.attrs.alt || "";

          if (updatedNode.attrs.width) {
            img.style.width = `${updatedNode.attrs.width}px`;
          } else {
            img.style.width = "";
          }
          if (updatedNode.attrs.height) {
            img.style.height = `${updatedNode.attrs.height}px`;
          } else {
            img.style.height = "";
          }

          return true;
        },
      };
    };
  },

  addCommands() {
    return {
      setFigure:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              src: options.src,
              alt: options.alt,
              width: options.width,
              height: options.height,
            },
            content: options.caption
              ? [{ type: "text", text: options.caption }]
              : [],
          });
        },
    };
  },
});

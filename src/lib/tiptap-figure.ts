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
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes, node }) {
    const caption = node.content?.content?.[0]?.text || "";
    return [
      "figure",
      mergeAttributes(this.options.HTMLAttributes, { class: "tiptap-figure" }),
      [
        "img",
        mergeAttributes(HTMLAttributes, {
          draggable: false,
          contenteditable: false,
        }),
      ],
      ["figcaption", caption],
    ];
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
            },
            content: options.caption
              ? [{ type: "text", text: options.caption }]
              : [],
          });
        },
    };
  },
});

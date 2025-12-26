import { updateElementsOnPage } from "content-manager";
import { exec, init, queryCommandState } from "pell";

// TODO:
// - make this dynamic by key so its reusable
// - replace all icons with lucide icons
const settings = {
  element: document.getElementById("editor"),
  onChange: (html) => console.log(html),
  // defaultParagraphSeparator: "div",
  styleWithCSS: true,
  actions: [
    {
      name: "bold",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bold-icon lucide-bold"><path d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8"/></svg>',
      title: "Bold",
      state: () => queryCommandState("bold"),
      result: () => exec("bold"),
    },
    {
      name: "italic",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-italic-icon lucide-italic"><line x1="19" x2="10" y1="4" y2="4"/><line x1="14" x2="5" y1="20" y2="20"/><line x1="15" x2="9" y1="4" y2="20"/></svg>',
      title: "Italic",
      state: () => queryCommandState("italic"),
      result: () => exec("italic"),
    },
    "underline",
    "strikethrough",
    "heading1",
    "heading2",
    "paragraph",
    "quote",
    "olist",
    "ulist",
    "code",
    "line",
    "link",
    {
      name: "image",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image-icon lucide-image"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>',
      title: "Image",
      result: () => {
        // TODO: file selector + upload to pb
        const url = window.prompt("Enter the image URL");
        if (url) exec("insertImage", url);
      },
    },
    {
      name: "justifyLeft",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-text-align-start-icon lucide-text-align-start"><path d="M21 5H3"/><path d="M15 12H3"/><path d="M17 19H3"/></svg>',
      title: "Justify left",
      result: () => exec("justifyLeft"),
    },
    {
      name: "justifyCenter",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-text-align-center-icon lucide-text-align-center"><path d="M21 5H3"/><path d="M17 12H7"/><path d="M19 19H5"/></svg>',
      title: "Justify center",
      result: () => exec("justifyCenter"),
    },
    {
      name: "justifyRight",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-text-align-end-icon lucide-text-align-end"><path d="M21 5H3"/><path d="M21 12H9"/><path d="M21 19H7"/></svg>',
      title: "Justify right",
      result: () => exec("justifyRight"),
    },
    {
      name: "justifyFull",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-text-align-justify-icon lucide-text-align-justify"><path d="M3 5h18"/><path d="M3 12h18"/><path d="M3 19h18"/></svg>',
      title: "Justify full",
      result: () => exec("justifyFull"),
    },
    {
      name: "subscript",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-subscript-icon lucide-subscript"><path d="m4 5 8 8"/><path d="m12 5-8 8"/><path d="M20 19h-4c0-1.5.44-2 1.5-2.5S20 15.33 20 14c0-.47-.17-.93-.48-1.29a2.11 2.11 0 0 0-2.62-.44c-.42.24-.74.62-.9 1.07"/></svg>',
      title: "Subscript",
      result: () => exec("subscript"),
    },
    {
      name: "superscript",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-superscript-icon lucide-superscript"><path d="m4 19 8-8"/><path d="m12 19-8-8"/><path d="M20 12h-4c0-1.5.442-2 1.5-2.5S20 8.334 20 7.002c0-.472-.17-.93-.484-1.29a2.105 2.105 0 0 0-2.617-.436c-.42.239-.738.614-.899 1.06"/></svg>',
      title: "Superscript",
      result: () => exec("superscript"),
    },
    {
      name: "undo",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-undo-icon lucide-undo"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>',
      title: "Undo",
      result: () => exec("undo"),
    },
    {
      name: "redo",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-redo-icon lucide-redo"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7"/></svg>',
      title: "Redo",
      resutl: () => exec("redo"),
    },
    // "fontName",
    // "fontSize",
    // "indent",
    // "outdent",
    // "clearFormatting",
  ],
  content: '<div data-content="cv.cv"></div>',
};

init(settings);

await updateElementsOnPage("content", (element, item) => {
  element.innerHTML = item.value;
});

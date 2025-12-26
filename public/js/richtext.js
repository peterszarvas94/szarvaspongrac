import { updateElementsOnPage } from "content-manager";
import pell from "pell";
const { exec, init } = pell;

const settings = {
  element: document.getElementById("editor"),
  onChange: (html) => console.log(html),
  // defaultParagraphSeparator: "div",
  styleWithCSS: false,
  actions: [
    "bold",
    "italic",
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
    "image",
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
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-superscript-icon lucide-superscript"><path d="m4 19 8-8"/><path d="m12 19-8-8"/><path d="M20 12h-4c0-1.5.442-2 1.5-2.5S20 8.334 20 7.002c0-.472-.17-.93-.484-1.29a2.105 2.105 0 0 0-2.617-.436c-.42.239-.738.614-.899 1.06"/></svg>',
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

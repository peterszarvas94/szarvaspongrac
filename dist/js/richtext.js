import "quill";
import { pb } from "db";

/* eslint-disable */

// Initialize Quill editor
const initQuill = () => {
  const editorElement = document.getElementById("editor");
  if (!editorElement || !window.Quill) return;

  const quill = new window.Quill("#editor", {
    theme: "snow",
    modules: {
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link"],
        ["clean"],
      ],
    },
    placeholder: "Írj valamit...",
  });

  // Make quill instance globally accessible
  window.quill = quill;

  // Load initial content if there's a data-key
  loadInitialContent();
};

// Content operations
async function loadInitialContent() {
  const editorElement = document.getElementById("editor");
  const dataKey = editorElement?.dataset?.key;
  if (!dataKey) return;

  try {
    // Get content from PocketBase
    const record = await pb
      .collection("content")
      .getFirstListItem(`key="${dataKey}"`);
    if (record && record.value && window.quill) {
      window.quill.root.innerHTML = record.value;
    }
  } catch (error) {
    console.error("Failed to load content:", error);
  }
}

// Save content to PocketBase
let isSaving = false;
async function saveContent() {
  if (!window.quill || isSaving) return;

  isSaving = true;
  const saveButton = document.getElementById("save-button");
  if (saveButton) {
    saveButton.disabled = true;
    saveButton.textContent = "Mentés...";
  }

  try {
    const editorElement = document.getElementById("editor");
    const dataKey = editorElement?.dataset?.key;

    if (!dataKey) {
      throw new Error("No data-key found on editor element");
    }

    const content = window.quill.root.innerHTML;

    // Check if record exists
    const existingRecord = await pb
      .collection("content")
      .getFirstListItem(`key="${dataKey}"`);

    if (existingRecord) {
      // Update existing record
      await pb
        .collection("content")
        .update(existingRecord.id, { value: content });
    } else {
      // Create new record
      await pb.collection("content").create({ key: dataKey, value: content });
    }

    if (saveButton) {
      saveButton.disabled = false;
      saveButton.textContent = "Mentve";
    }

    console.log("Content saved successfully");
  } catch (error) {
    console.error("Failed to save content:", error);

    if (saveButton) {
      saveButton.disabled = false;
      saveButton.textContent = "Hiba!";
    }

    alert("Hiba történt a mentés során: " + error.message);
  } finally {
    isSaving = false;
  }
}

// Get current content
function getContent() {
  return window.quill ? window.quill.root.innerHTML : "";
}

// Set content
function setContent(html) {
  if (window.quill) {
    window.quill.root.innerHTML = html;
  }
}

// Initialize when DOM is ready
const init = () => {
  initQuill();

  // Add save button functionality if it exists
  const saveButton = document.getElementById("save-button");
  if (saveButton) {
    saveButton.addEventListener("click", saveContent);
  }

  // Expose functions globally
  window.quillAPI = {
    save: saveContent,
    getContent: getContent,
    setContent: setContent,
  };
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

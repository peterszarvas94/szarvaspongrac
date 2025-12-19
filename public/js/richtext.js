import "quill";
import { pb } from "db";

// Initialize Quill editor
const initQuill = () => {
  const editorElement = document.getElementById("editor");
  if (!editorElement || !window.Quill) return;

  window.quill = new window.Quill("#editor", {
    theme: "snow",
    modules: {
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link"],
        ["clean"],
      ]
    },
    placeholder: "Írj valamit..."
  });
  loadInitialContent();
};

// Load content from PocketBase
async function loadInitialContent() {
  const dataKey = document.getElementById("editor")?.dataset?.key;  
  if (!dataKey) return;

  try {
    const record = await pb.collection("content").getFirstListItem(`key="${dataKey}"`);
    if (record?.value && window.quill) {
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
    const dataKey = document.getElementById("editor")?.dataset?.key;
    if (!dataKey) {
      throw new Error("No data-key found");
    }
    
    const content = window.quill.root.innerHTML;
    const existingRecord = await pb.collection("content").getFirstListItem(`key="${dataKey}"`);
    
    if (existingRecord) {
      await pb.collection("content").update(existingRecord.id, { value: content });
    } else {
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

// Handle images from Quill
window.quill?.on("text-change", async (delta) => {
  delta.ops?.forEach(op => {
    if (op.insert?.image) {
      try {
        await pb.collection("image").create({
          file: await urlToFile(op.insert.image),
          key: "editor-image"
        });
      } catch (error) {
        console.error("Image upload failed:", error);
      }
    }
  });
});

// Convert URL to File
async function urlToFile(url) {
  const response = await fetch(url);
  const blob = await response.blob();
  return new File([blob], "upload.jpg", { type: "image/jpeg" });
}

// Initialize
const init = () => {
  initQuill();
  const saveButton = document.getElementById("save-button");
  if (saveButton) {
    saveButton.addEventListener("click", saveContent);
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
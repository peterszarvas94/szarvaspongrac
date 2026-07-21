const bound = new WeakSet();

function isDuplicateFile(file, existingFiles) {
  return existingFiles.some(
    (existing) => existing.name === file.name && existing.size === file.size,
  );
}

function toInt(input) {
  const parsed = Number.parseInt(input, 10);
  return Number.isNaN(parsed) ? null : parsed;
}

function updateLabelClasses(label, active) {
  const div = label?.querySelector("div");
  if (!div) return;
  div.classList.toggle("border-base-300", !active);
  div.classList.toggle("border-base-content", active);
}

export function bindImageUpload(form) {
  if (!(form instanceof HTMLFormElement) || bound.has(form)) return;
  bound.add(form);

  const input = form.querySelector('input[type="file"]');
  const label = form.querySelector("label");
  const fileList = form.querySelector("[data-files]");
  const template = form.querySelector("template[data-file-row]");
  const maxItems = toInt(form.dataset.maxItems);

  if (!(input instanceof HTMLInputElement)) return;

  let dt = new DataTransfer();

  function updateInputFiles() {
    input.files = dt.files;
  }

  function updateFileList() {
    if (!fileList || !template) return;
    fileList.innerHTML = "";

    [...dt.files].forEach((file) => {
      const row = template.content.cloneNode(true);
      const span = row.querySelector("span");
      const button = row.querySelector("button");
      if (span) span.textContent = file.name;
      if (button) button.onclick = () => removeFile(file);
      fileList.appendChild(row);
    });
  }

  function clearFiles() {
    dt = new DataTransfer();
    updateInputFiles();
    updateFileList();
  }

  function removeFile(file) {
    const next = new DataTransfer();
    [...dt.files].forEach((f) => {
      if (f !== file) next.items.add(f);
    });
    dt = next;
    updateInputFiles();
    updateFileList();
  }

  function updateFiles(files) {
    if (!files.length) return;
    if (maxItems === 1) {
      dt = new DataTransfer();
      dt.items.add(files[0]);
    } else {
      files.forEach((f) => {
        if (!isDuplicateFile(f, [...dt.files])) dt.items.add(f);
      });
    }
    updateInputFiles();
    updateFileList();
  }

  label?.addEventListener("dragenter", (e) => {
    e.preventDefault();
    updateLabelClasses(label, true);
  });
  label?.addEventListener("dragover", (e) => {
    e.preventDefault();
    updateLabelClasses(label, true);
  });
  label?.addEventListener("dragleave", (e) => {
    e.preventDefault();
    updateLabelClasses(label, false);
  });
  label?.addEventListener("drop", (e) => {
    e.preventDefault();
    updateLabelClasses(label, false);
    updateFiles(Array.from(e.dataTransfer?.files ?? []));
  });

  input.addEventListener("change", () => {
    updateFiles(input.files ? Array.from(input.files) : []);
  });

  form.addEventListener("reset", () => {
    clearFiles();
  });

  document.addEventListener("datastar-fetch", (evt) => {
    if (evt.detail?.el !== form) return;
    const type = evt.detail?.type;
    if (type === "finished" || type === "error" || type === "retries-failed") {
      clearFiles();
    }
  });
}

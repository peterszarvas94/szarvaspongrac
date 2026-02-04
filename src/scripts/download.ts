import { getImageById } from "@scripts/db";

const downloadButtons =
  document.querySelectorAll<HTMLButtonElement>("[data-download]");

export function initDownloadButton(button: HTMLButtonElement) {
  button.addEventListener("click", async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const id = button.dataset.download;
    if (!id) return;

    const image = await getImageById(id);
    if (!image) return;

    const url = image.url;
    const filename = image.filename;

    try {
      await downloadImage(url, filename);
    } catch (error) {
      console.error("Download failed:", error);
    }
  });
}

downloadButtons.forEach((button) => {
  initDownloadButton(button);
});

export async function downloadImage(url: string, filename: string) {
  const res = await fetch(url);
  const blob = await res.blob();
  const blobUrl = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = blobUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
}

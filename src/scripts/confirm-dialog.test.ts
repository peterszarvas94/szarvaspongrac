/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach } from "vitest";
import { confirm, type ConfirmOptions } from "./confirm-dialog";

describe("confirm-dialog", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="confirm-dialog" popover>
        <h3 id="confirm-dialog-title">Title</h3>
        <p id="confirm-dialog-message">Message</p>
        <button id="confirm-dialog-cancel">Cancel</button>
        <button id="confirm-dialog-confirm">Confirm</button>
      </div>
    `;

    // Mock popover API
    const dialog = document.getElementById("confirm-dialog") as HTMLElement;
    dialog.showPopover = () => {
      dialog.setAttribute("open", "");
    };
    dialog.hidePopover = () => {
      dialog.removeAttribute("open");
      dialog.dispatchEvent(new Event("toggle"));
    };
  });

  it("sets title and message from options", async () => {
    const options: ConfirmOptions = {
      title: "Test Title",
      message: "Test Message",
    };

    // Start confirm but don't await yet
    const promise = confirm(options);

    const title = document.getElementById("confirm-dialog-title");
    const message = document.getElementById("confirm-dialog-message");

    expect(title?.textContent).toBe("Test Title");
    expect(message?.textContent).toBe("Test Message");

    // Click confirm to resolve
    document.getElementById("confirm-dialog-confirm")?.click();
    await promise;
  });

  it("sets custom button text", async () => {
    const options: ConfirmOptions = {
      message: "Test",
      confirmText: "Yes",
      cancelText: "No",
    };

    const promise = confirm(options);

    const confirmBtn = document.getElementById("confirm-dialog-confirm");
    const cancelBtn = document.getElementById("confirm-dialog-cancel");

    expect(confirmBtn?.textContent).toBe("Yes");
    expect(cancelBtn?.textContent).toBe("No");

    confirmBtn?.click();
    await promise;
  });

  it("returns true when confirm is clicked", async () => {
    const promise = confirm({ message: "Test" });

    document.getElementById("confirm-dialog-confirm")?.click();

    expect(await promise).toBe(true);
  });

  it("returns false when cancel is clicked", async () => {
    const promise = confirm({ message: "Test" });

    document.getElementById("confirm-dialog-cancel")?.click();

    expect(await promise).toBe(false);
  });

  it("returns false when dialog elements are missing", async () => {
    document.body.innerHTML = "";

    const result = await confirm({ message: "Test" });

    expect(result).toBe(false);
  });
});

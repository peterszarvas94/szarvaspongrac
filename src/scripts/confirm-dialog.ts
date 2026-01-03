// Confirm Dialog using native Popover API

export interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

export function confirm(options: ConfirmOptions): Promise<boolean> {
  return new Promise((resolve) => {
    const dialog = document.getElementById("confirm-dialog") as HTMLElement & {
      showPopover: () => void;
      hidePopover: () => void;
    };
    const title = document.getElementById("confirm-dialog-title");
    const message = document.getElementById("confirm-dialog-message");
    const confirmBtn = document.getElementById("confirm-dialog-confirm");
    const cancelBtn = document.getElementById("confirm-dialog-cancel");

    if (!dialog || !title || !message || !confirmBtn || !cancelBtn) {
      console.error("Confirm dialog elements not found");
      resolve(false);
      return;
    }

    // Set content
    if (options.title) {
      title.textContent = options.title;
    }
    message.textContent = options.message;
    if (options.confirmText) {
      confirmBtn.textContent = options.confirmText;
    }
    if (options.cancelText) {
      cancelBtn.textContent = options.cancelText;
    }

    // Handle confirm
    const handleConfirm = () => {
      dialog.hidePopover();
      cleanup();
      resolve(true);
    };

    // Handle cancel
    const handleCancel = () => {
      dialog.hidePopover();
      cleanup();
      resolve(false);
    };

    // Handle backdrop click
    const handleToggle = (e: Event) => {
      const toggleEvent = e as ToggleEvent;
      if (toggleEvent.newState === "closed") {
        cleanup();
        resolve(false);
      }
    };

    // Cleanup listeners
    const cleanup = () => {
      confirmBtn.removeEventListener("click", handleConfirm);
      cancelBtn.removeEventListener("click", handleCancel);
      dialog.removeEventListener("toggle", handleToggle);
    };

    // Add listeners
    confirmBtn.addEventListener("click", handleConfirm);
    cancelBtn.addEventListener("click", handleCancel);
    dialog.addEventListener("toggle", handleToggle);

    // Show dialog
    dialog.showPopover();
  });
}

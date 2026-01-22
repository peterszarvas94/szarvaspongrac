import { TypedEvent } from "@scripts/event";

const container = document.querySelector<HTMLDivElement>("[data-toaster]");
const template = document.querySelector<HTMLTemplateElement>("#toast-template");
const TOAST_DURATION = 3000;
const levelClasses: Record<ToastLevel, string> = {
  info: "alert-info",
  success: "alert-success",
  warning: "alert-warning",
  error: "alert-error",
};

export type ToastLevel = "info" | "success" | "warning" | "error";

export interface ToastDetail {
  message: string;
  level: ToastLevel;
}

export class ToastEvent extends TypedEvent<ToastDetail> {
  static eventName = "toast";

  constructor(message: string, level: ToastLevel = "info") {
    super(ToastEvent.eventName, { message, level });
  }
}

export function showAlert(message: string, level: ToastLevel = "info") {
  window.dispatchEvent(new ToastEvent(message, level));
}

function removeToast(div: HTMLDivElement) {
  div.classList.add("opacity-0", "transition-opacity", "duration-300");
  setTimeout(() => div.remove(), 300);
}

window.addEventListener(ToastEvent.eventName, ((e: ToastEvent) => {
  if (!container) return;

  const { message, level } = e.detail;

  const toast = template?.content.cloneNode(true) as
    | DocumentFragment
    | undefined;
  if (!toast) return;

  const alertDiv = toast.querySelector<HTMLDivElement>(".alert");
  if (!alertDiv) return;

  const span = toast.querySelector("span");
  if (!span) return;

  const icons = toast.querySelectorAll<SVGElement>("[data-icon]");

  alertDiv.classList.add(levelClasses[level]);
  span.textContent = message;

  icons.forEach((icon) => {
    if (icon.dataset.icon === level) {
      icon.classList.remove("hidden");
    }
  });

  alertDiv.addEventListener("click", () => removeToast(alertDiv));
  container.appendChild(toast);

  setTimeout(() => removeToast(alertDiv), TOAST_DURATION);
}) as EventListener);

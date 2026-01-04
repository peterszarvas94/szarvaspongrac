import { TypedEvent } from "./event";

const container = document.querySelector<HTMLDivElement>("[data-toaster]");
const template = document.querySelector<HTMLTemplateElement>("#toast-template");

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

const TOAST_DURATION = 3000;
const levelClasses: Record<ToastLevel, string> = {
  info: "alert-info",
  success: "alert-success",
  warning: "alert-warning",
  error: "alert-error",
};

window.addEventListener(ToastEvent.eventName, ((e: ToastEvent) => {
  const { message, level } = e.detail;

  const toast = template?.content.cloneNode(true) as
    | DocumentFragment
    | undefined;
  const alertDiv = toast?.querySelector<HTMLDivElement>(".alert");
  const span = toast?.querySelector("span")!;
  const icons = toast?.querySelectorAll<SVGElement>("[data-icon]");

  alertDiv?.classList.add(levelClasses[level]);
  span.textContent = message;

  icons?.forEach((icon) => {
    if (icon.dataset.icon === level) {
      icon.classList.remove("hidden");
    }
  });

  const removeToast = () => {
    alertDiv?.classList.add("opacity-0", "transition-opacity", "duration-300");
    setTimeout(() => alertDiv?.remove(), 300);
  };

  alertDiv?.addEventListener("click", removeToast);
  if (toast && container) container.appendChild(toast);

  setTimeout(removeToast, TOAST_DURATION);
}) as EventListener);

import "solid-js";

declare module "solid-js/jsx-runtime" {
  namespace JSX {
    interface CustomEvents {
      editModeChanged: CustomEvent<{ editMode: boolean }>;
    }
  }
}

export class TypedEvent<T> extends CustomEvent<T> {
  constructor(eventName: string, detail: T) {
    super(eventName, {
      detail,
      bubbles: true, // optional: allows event to bubble
      composed: true, // optional: allows crossing shadow DOM
    });
  }
}

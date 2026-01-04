export class TypedEvent<T> extends CustomEvent<T> {
  constructor(eventName: string, detail: T) {
    super(eventName, {
      detail,
      bubbles: true,
      composed: true,
    });
  }
}

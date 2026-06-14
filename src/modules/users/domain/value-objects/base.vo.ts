export abstract class ValueObject<T> {
  readonly value: T;

  constructor(value: T) {
    this.value = value;
  }
}

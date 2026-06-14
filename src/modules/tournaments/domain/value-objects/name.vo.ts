import { ValueObject } from './base.vo';

export class InvalidNameError extends Error {
  constructor() {
    super('El nombre no debe estar vacío');
    this.name = 'InvalidNameError';
  }
}

export class Name extends ValueObject<string> {
  constructor(name: string) {
    if (!name || name.length === 0) {
      throw new InvalidNameError();
    }
    super(name);
  }
}

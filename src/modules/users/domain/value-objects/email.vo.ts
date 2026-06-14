import { ValueObject } from './base.vo';

export class InvalidEmailError extends Error {
  constructor() {
    super('El email no tiene un formato válido');
    this.name = 'InvalidEmailError';
  }
}

export class Email extends ValueObject<string> {
  constructor(email: string) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !regex.test(email)) {
      throw new InvalidEmailError();
    }
    super(email.toLowerCase().trim());
  }
}

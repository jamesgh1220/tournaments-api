import { ValueObject } from './base.vo';

export class InvalidPasswordError extends Error {
  constructor() {
    super('La contraseña debe tener al menos 6 caracteres');
    this.name = 'InvalidPasswordError';
  }
}

export class Password extends ValueObject<string> {
  constructor(password: string) {
    if (!password || password.length < 6) {
      throw new InvalidPasswordError();
    }
    super(password);
  }
}

import { ValueObject } from './base.vo';

export class InvalidDateError extends Error {
  constructor() {
    super('La fecha no es válida');
    this.name = 'InvalidDateError';
  }
}

export class MatchDate extends ValueObject<Date> {
  constructor(date: Date) {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      throw new InvalidDateError();
    }
    super(date);
  }

  toString(): string {
    const year = this.value.getFullYear();
    const month = String(this.value.getMonth() + 1).padStart(2, '0');
    const day = String(this.value.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

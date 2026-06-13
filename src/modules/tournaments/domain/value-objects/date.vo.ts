export class MatchDate {
  readonly value: Date;

  constructor(date: Date) {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      throw new Error('La fecha no es válida');
    }

    this.value = date;
  }

  toString(): string {
    const year = this.value.getFullYear();
    const month = String(this.value.getMonth() + 1).padStart(2, '0');
    const day = String(this.value.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}

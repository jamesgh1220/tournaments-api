export class Name {
  readonly value: string;

  constructor(name: string) {
    if (!name || name.length === 0) {
      throw new Error('El nombre no debe estar vacío');
    }
    this.value = name;
  }
}

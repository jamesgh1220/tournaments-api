export class Email {
  readonly value: string;

  constructor(email: string) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !regex.test(email)) {
      throw new Error('El email no tiene un formato válido');
    }
    this.value = email.toLowerCase().trim();
  }
}

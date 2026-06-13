export class Password {
  readonly value: string;

  constructor(password: string) {
    if (!password || password.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }
    this.value = password;
  }
}

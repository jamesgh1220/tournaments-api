export class PhaseType {
  id?: number;
  name: string;

  static create(name: string) {
    const phaseType = new PhaseType();
    phaseType.name = name;
    return phaseType;
  }
}

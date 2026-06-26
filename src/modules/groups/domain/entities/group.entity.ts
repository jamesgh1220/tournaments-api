export class Group {
  id?: number;

  name: string;
  phaseId: number;

  static create(name: string, phaseId: number) {
    const group = new Group();
    group.name = name;
    group.phaseId = phaseId;

    return group;
  }
}

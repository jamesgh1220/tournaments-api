export class Team {
  id?: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;

  static create(name: string): Team {
    const team = new Team();
    team.name = name;
    return team;
  }
}

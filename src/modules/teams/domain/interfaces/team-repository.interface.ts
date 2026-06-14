import { Team } from '../entities/teams.entity';

export interface ITeamRepository {
  find(): Promise<Team[]>;
  create(team: Team): Promise<Team>;
  findById(id: number): Promise<Team | null>;
  findByName(name: string): Promise<Team | null>;
  update(id: number, data: Partial<Team>): Promise<Team | null>;
  delete(id: number): Promise<void>;
}

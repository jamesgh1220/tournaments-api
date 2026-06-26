import { Match } from '../entities/match.entity';

export interface IMatchRepository {
  find(): Promise<Match[]>;
  create(team: Match): Promise<Match>;
  createMany(matches: Match[]): Promise<Match[]>;
  findById(id: number): Promise<Match | null>;
  update(id: number, data: Partial<Match>): Promise<Match | null>;
  delete(id: number): Promise<void>;
}

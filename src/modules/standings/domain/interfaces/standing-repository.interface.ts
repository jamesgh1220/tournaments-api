import { Standing } from '../entities/standing.entity';

export interface IStandingRepository {
  // find(): Promise<Standing[]>;
  create(team: Standing): Promise<Standing>;
  createMany(team: Standing[]): Promise<Standing[]>;
  // findById(id: number): Promise<Standing | null>;
  update(id: number, data: Partial<Standing>): Promise<Standing | null>;
  delete(id: number): Promise<void>;
}

import { Group } from '../entities/group.entity';

export interface IGroupRepository {
  find(): Promise<Group[]>;
  create(group: Group): Promise<Group>;
  createMany(groups: Group[]): Promise<Group[]>;
  findById(id: number): Promise<Group | null>;
  update(id: number, data: Partial<Group>): Promise<Group | null>;
  delete(id: number): Promise<void>;
}

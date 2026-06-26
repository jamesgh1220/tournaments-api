import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GroupOrmEntity } from './group.orm-entity';
import { GroupMapper } from './group.mapper';
import type { IGroupRepository } from '../../domain/interfaces/group-repository.interface';
import { Group } from '../../domain/entities/group.entity';

@Injectable()
export class GroupRepository implements IGroupRepository {
  constructor(
    @InjectRepository(GroupOrmEntity)
    private readonly groupRepo: Repository<GroupOrmEntity>,
  ) {}

  async find(): Promise<Group[]> {
    const ormEntities = await this.groupRepo.find();
    return ormEntities.map(GroupMapper.toDomain);
  }

  async create(group: Group): Promise<Group> {
    const ormEntity = GroupMapper.toOrm(group);
    const saved = await this.groupRepo.save(ormEntity);
    return GroupMapper.toDomain(saved);
  }

  async createMany(groups: Group[]): Promise<Group[]> {
    const orm = groups.map(GroupMapper.toOrm);
    const saved = await this.groupRepo.save(orm);
    return saved.map(GroupMapper.toDomain);
  }

  async findById(id: number): Promise<Group | null> {
    const ormEntity = await this.groupRepo.findOneBy({ id });
    return ormEntity ? GroupMapper.toDomain(ormEntity) : null;
  }

  async update(id: number, data: Partial<Group>): Promise<Group | null> {
    const orm = await this.groupRepo.findOneBy({ id });
    if (!orm) return null;

    orm.name = data.name ? data.name : orm.name;
    orm.phaseId = data.phaseId ? data.phaseId : orm.phaseId;
    const saved = await this.groupRepo.save(orm);
    return GroupMapper.toDomain(saved);
  }

  async delete(id: number): Promise<void> {
    const result = await this.groupRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Match with id ${id} not found`);
    }
  }
}

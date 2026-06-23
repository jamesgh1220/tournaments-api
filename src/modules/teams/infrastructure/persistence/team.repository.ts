import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from '../../domain/entities/teams.entity';
import { TeamOrmEntity } from './team.orm-entity';
import { TeamMapper } from './team.mapper';
import type { ITeamRepository } from '../../domain/interfaces/team-repository.interface';

@Injectable()
export class TeamRepository implements ITeamRepository {
  constructor(
    @InjectRepository(TeamOrmEntity)
    private readonly teamRepo: Repository<TeamOrmEntity>,
  ) {}

  async find(): Promise<Team[]> {
    const ormEntities = await this.teamRepo.find();
    return ormEntities.map(TeamMapper.toDomain);
  }

  async create(team: Team): Promise<Team> {
    const ormEntity = TeamMapper.toOrm(team);
    const saved = await this.teamRepo.save(ormEntity);
    return TeamMapper.toDomain(saved);
  }

  async findById(id: number): Promise<Team | null> {
    const ormEntity = await this.teamRepo.findOneBy({ id });
    return ormEntity ? TeamMapper.toDomain(ormEntity) : null;
  }

  async findByName(name: string): Promise<Team | null> {
    const ormEntity = await this.teamRepo.findOneBy({ name });
    return ormEntity ? TeamMapper.toDomain(ormEntity) : null;
  }

  async update(id: number, data: Partial<Team>): Promise<Team | null> {
    const orm = await this.teamRepo.findOneBy({ id });
    if (!orm) return null;

    if (data.name !== undefined) orm.name = data.name;

    const saved = await this.teamRepo.save(orm);
    return TeamMapper.toDomain(saved);
  }

  async delete(id: number): Promise<void> {
    const result = await this.teamRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Team with id ${id} not found`);
    }
  }
}

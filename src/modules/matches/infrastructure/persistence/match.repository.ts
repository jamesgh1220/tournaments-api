import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from 'src/groups/entities/group.entity';
import { TeamOrmEntity } from 'src/modules/teams/infrastructure/persistence/team.orm-entity';
import { Match } from '../../domain/entities/match.entity';
import { MatchOrmEntity } from './match.orm-entity';
import { MatchMapper } from './match.mapper';
import type { IMatchRepository } from '../../domain/interfaces/match-repository.interface';

@Injectable()
export class MatchRepository implements IMatchRepository {
  constructor(
    @InjectRepository(MatchOrmEntity)
    private readonly matchRepo: Repository<MatchOrmEntity>,
  ) {}

  async find(): Promise<Match[]> {
    const ormEntities = await this.matchRepo.find();
    return ormEntities.map(MatchMapper.toDomain);
  }

  async create(match: Match): Promise<Match> {
    const ormEntity = MatchMapper.toOrm(match);
    ormEntity.scheduledAt = new Date();
    const saved = await this.matchRepo.save(ormEntity);
    return MatchMapper.toDomain(saved);
  }

  async createMany(matches: Match[]): Promise<Match[]> {
    const orm = matches.map(MatchMapper.toOrm);
    orm.forEach((m) => (m.scheduledAt = new Date()));
    const saved = await this.matchRepo.save(orm); // save acepta array
    return saved.map(MatchMapper.toDomain);
  }

  async findById(id: number): Promise<Match | null> {
    const ormEntity = await this.matchRepo.findOneBy({ id });
    return ormEntity ? MatchMapper.toDomain(ormEntity) : null;
  }

  async update(id: number, data: Partial<Match>): Promise<Match | null> {
    const orm = await this.matchRepo.findOneBy({ id });
    if (!orm) return null;

    if (data.homeScore !== undefined) orm.homeScore = data.homeScore;
    if (data.awayScore !== undefined) orm.awayScore = data.awayScore;
    if (data.status !== undefined) orm.status = data.status;
    if (data.phaseId !== undefined) orm.phaseId = data.phaseId;

    if (data.homeTeamId !== undefined) {
      orm.homeTeamId = data.homeTeamId;
      orm.homeTeam = { id: data.homeTeamId } as TeamOrmEntity;
    }
    if (data.awayTeamId !== undefined) {
      orm.awayTeamId = data.awayTeamId;
      orm.awayTeam = { id: data.awayTeamId } as TeamOrmEntity;
    }
    if (data.groupId !== undefined) {
      orm.groupId = data.groupId;
      orm.group = { id: data.groupId } as Group;
    }

    const saved = await this.matchRepo.save(orm);
    return MatchMapper.toDomain(saved);
  }

  async delete(id: number): Promise<void> {
    const result = await this.matchRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Match with id ${id} not found`);
    }
  }
}

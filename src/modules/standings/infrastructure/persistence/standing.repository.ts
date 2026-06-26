import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Standing } from '../../domain/entities/standing.entity';
import { StandingOrmEntity } from './standing.orm-entity';
import type { IStandingRepository } from '../../domain/interfaces/standing-repository.interface';
import { StandingMapper } from './standing.mapper';
import { TournamentOrmEntity } from 'src/modules/tournaments/infrastructure/persistence/tournament.orm-entity';
import { PhaseOrmEntity } from 'src/modules/phase/infrastructure/persistence/phase.orm-entity';
import { TeamOrmEntity } from 'src/modules/teams/infrastructure/persistence/team.orm-entity';
import { GroupOrmEntity } from 'src/modules/groups/infrastructure/persistence/group.orm-entity';

@Injectable()
export class StandingRepository implements IStandingRepository {
  constructor(
    @InjectRepository(StandingOrmEntity)
    private readonly standingRepo: Repository<StandingOrmEntity>,
  ) {}

  async create(standing: Standing): Promise<Standing> {
    const ormEntity = StandingMapper.toOrm(standing);
    const saved = await this.standingRepo.save(ormEntity);
    return StandingMapper.toDomain(saved);
  }

  async createMany(standings: Standing[]): Promise<Standing[]> {
    const orm = standings.map(StandingMapper.toOrm);
    const saved = await this.standingRepo.save(orm);
    const standingsWithRelations = await this.standingRepo.find({
      where: {
        id: In(saved.map((s) => s.id)),
      },
      relations: {
        team: true,
      },
    });

    return standingsWithRelations.map(StandingMapper.toDomain);
  }

  async update(id: number, data: Partial<Standing>): Promise<Standing | null> {
    const orm = await this.standingRepo.findOneBy({ id });
    if (!orm) return null;

    orm.played = data.played ? data.played : orm.played;
    orm.wins = data.wins ? data.wins : orm.wins;
    orm.draws = data.draws ? data.draws : orm.draws;
    orm.losses = data.losses ? data.losses : orm.losses;
    orm.goalsFor = data.goalsFor ? data.goalsFor : orm.goalsFor;
    orm.goalsAgainst = data.goalsAgainst ? data.goalsAgainst : orm.goalsAgainst;
    orm.points = data.points ? data.points : orm.points;

    if (data.tournamentId) {
      orm.tournamentId = data.tournamentId;
      orm.tournament = { id: data.tournamentId } as TournamentOrmEntity;
    }

    if (data.phaseId) {
      orm.phaseId = data.phaseId;
      orm.phase = { id: data.phaseId } as PhaseOrmEntity;
    }

    if (data.groupId) {
      orm.groupId = data.groupId;
      orm.group = { id: data.groupId } as GroupOrmEntity;
    }

    if (data.teamId) {
      orm.teamId = data.teamId;
      orm.team = { id: data.teamId } as TeamOrmEntity;
    }

    const saved = await this.standingRepo.save(orm);
    return StandingMapper.toDomain(saved);
  }

  async delete(id: number): Promise<void> {
    const result = await this.standingRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Standing with id ${id} not found`);
    }
  }
}

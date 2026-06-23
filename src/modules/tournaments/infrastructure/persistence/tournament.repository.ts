import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tournament } from '../../domain/entities/tournament.entity';
import { TournamentOrmEntity } from './tournament.orm-entity';
import { TournamentMapper } from './tournament.mapper';
import type { ITournamentRepository } from '../../domain/interfaces/tournament-repository.interface';
import { TeamOrmEntity } from 'src/modules/teams/infrastructure/persistence/team.orm-entity';

@Injectable()
export class TournamentRepository implements ITournamentRepository {
  constructor(
    @InjectRepository(TournamentOrmEntity)
    private readonly tournamentRepo: Repository<TournamentOrmEntity>,
    @InjectRepository(TeamOrmEntity)
    private readonly teamRepo: Repository<TeamOrmEntity>,
  ) {}

  async find(): Promise<Tournament[]> {
    const ormEntities = await this.tournamentRepo.find({
      relations: { teams: true },
    });
    return ormEntities.map(TournamentMapper.toDomain);
  }

  async create(tournament: Tournament): Promise<Tournament> {
    const ormEntity = TournamentMapper.toOrm(tournament);
    const saved = await this.tournamentRepo.save(ormEntity);
    return TournamentMapper.toDomain(saved);
  }

  async findById(id: number): Promise<Tournament | null> {
    const ormEntity = await this.tournamentRepo.findOneBy({ id });
    return ormEntity ? TournamentMapper.toDomain(ormEntity) : null;
  }

  async findByName(name: string): Promise<Tournament | null> {
    const ormEntity = await this.tournamentRepo.findOneBy({ name });
    return ormEntity ? TournamentMapper.toDomain(ormEntity) : null;
  }

  async update(
    id: number,
    data: Partial<Tournament>,
  ): Promise<Tournament | null> {
    const orm = await this.tournamentRepo.findOneBy({ id });
    if (!orm) return null;

    if (data.name !== undefined) orm.name = data.name;
    if (data.state !== undefined) orm.state = data.state;
    if (data.configuration !== undefined) orm.configuration = data.configuration;
    if (data.startDate !== undefined) orm.startDate = data.startDate;

    const saved = await this.tournamentRepo.save(orm);
    return TournamentMapper.toDomain(saved);
  }

  async delete(id: number): Promise<void> {
    const result = await this.tournamentRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Tournament with id ${id} not found`);
    }
  }

  async addTeamToTournament(
    tournamentId: number,
    teamId: number,
  ): Promise<Tournament | null> {
    const orm = await this.tournamentRepo.findOne({
      where: { id: tournamentId },
      relations: { teams: true },
    });

    if (!orm) {
      throw new NotFoundException(`Torneo #${tournamentId} no encontrado`);
    }

    const teamExists = orm.teams.some((team) => team.id === teamId);
    if (teamExists) {
      const existing = orm.teams.find((t) => t.id === teamId);
      throw new NotFoundException(
        `El equipo ${existing?.name} ya existe en el torneo.`,
      );
    }

    const team = await this.teamRepo.findOneBy({ id: teamId });
    if (!team) {
      throw new NotFoundException(
        `Torneo #${tournamentId} o Equipo #${teamId} no encontrado`,
      );
    }

    orm.teams.push(team);
    const saved = await this.tournamentRepo.save(orm);
    return TournamentMapper.toDomain(saved);
  }

  async removeTeamFromTournament(
    tournamentId: number,
    teamId: number,
  ): Promise<Tournament | null> {
    const orm = await this.tournamentRepo.findOne({
      where: { id: tournamentId },
      relations: { teams: true },
    });

    if (!orm) {
      throw new NotFoundException(`Torneo #${tournamentId} no encontrado`);
    }

    const teamExists = orm.teams.some((team) => team.id === teamId);
    if (!teamExists) {
      throw new NotFoundException(
        `El equipo #${teamId} no pertenece al torneo #${tournamentId}`,
      );
    }

    orm.teams = orm.teams.filter((team) => team.id !== teamId);
    const saved = await this.tournamentRepo.save(orm);
    return TournamentMapper.toDomain(saved);
  }
}

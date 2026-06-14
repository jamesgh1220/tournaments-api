import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tournament } from '../../domain/entities/tournament.entity';
import { TournamentOrmEntity } from './tournament.orm-entity';
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
    return await this.tournamentRepo.find({
      relations: { teams: true },
    });
  }

  async create(tournament: Tournament): Promise<Tournament> {
    return await this.tournamentRepo.save(tournament);
  }

  async findById(id: number): Promise<Tournament | null> {
    return await this.tournamentRepo.findOne({
      where: { id },
    });
  }

  async findByName(name: string): Promise<Tournament | null> {
    return await this.tournamentRepo.findOne({
      where: { name },
    });
  }

  async update(
    id: number,
    data: Partial<Tournament>,
  ): Promise<Tournament | null> {
    await this.tournamentRepo.update(id, data);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    const orm = await this.tournamentRepo.findOne({ where: { id } });

    if (!orm) {
      throw new Error(`El torneo con id ${id} no existe`);
    }

    await this.tournamentRepo.remove(orm);
  }

  async addTeamToTournament(
    tournamentId: number,
    teamId: number,
  ): Promise<Tournament> {
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
    return await this.tournamentRepo.save(orm);
  }

  async removeTeamFromTournament(
    tournamentId: number,
    teamId: number,
  ): Promise<Tournament> {
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
    return await this.tournamentRepo.save(orm);
  }
}

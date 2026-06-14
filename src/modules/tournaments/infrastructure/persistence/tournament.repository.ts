import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tournament } from '../../domain/entities/tournament.entity';
import type { ITournamentRepository } from '../../domain/interfaces/tournament-repository.interface';
import { Team } from 'src/modules/teams/domain/entities/teams.entity';

@Injectable()
export class TournamentRepository implements ITournamentRepository {
  constructor(
    @InjectRepository(Tournament)
    private readonly tournamentRepo: Repository<Tournament>,
    @InjectRepository(Team)
    private readonly teamRepo: Repository<Team>,
  ) {}

  async find(): Promise<Tournament[] | []> {
    return await this.tournamentRepo.find();
  }

  async create(tournament: Tournament): Promise<Tournament> {
    return await this.tournamentRepo.save(tournament);
  }

  async findById(id: number): Promise<Tournament | null> {
    return await this.tournamentRepo.findOne({ where: { id } });
  }

  async findByName(name: string): Promise<Tournament | null> {
    return await this.tournamentRepo.findOne({ where: { name } });
  }

  async update(
    id: number,
    data: Partial<Tournament>,
  ): Promise<Tournament | null> {
    await this.tournamentRepo.update(id, data);
    return await this.findById(id);
  }

  async delete(id: number): Promise<void> {
    const tournament = await this.findById(id);

    if (!tournament) {
      throw new Error(`El torneo con id ${id} no existe`);
    }

    await this.tournamentRepo.remove(tournament);
  }

  async addTeamToTournament(
    tournamentId: number,
    teamId: number,
  ): Promise<Tournament> {
    const tournament = await this.tournamentRepo.findOne({
      where: { id: tournamentId },
      relations: {
        teams: true,
      },
    });

    const teamExistsInTournament = tournament?.teams.find(
      (team) => team.id === teamId,
    );

    if (teamExistsInTournament)
      throw new NotFoundException(
        `El equipo ${teamExistsInTournament?.name} ya existe en el torneo.`,
      );

    const team = await this.teamRepo.findOneBy({ id: teamId });

    if (!team || !tournament)
      throw new NotFoundException(
        `Torneo #${tournamentId} o Equipo #${teamId} no encontrado`,
      );

    tournament.teams.push(team);
    return this.tournamentRepo.save(tournament);
  }

  async removeTeamToTournament(
    tournamentId: number,
    teamId: number,
  ): Promise<Tournament> {
    console.log('llega');
    const tournament = await this.tournamentRepo.findOne({
      where: { id: tournamentId },
      relations: {
        teams: true,
      },
    });

    if (!tournament) {
      throw new NotFoundException(`Torneo #${tournamentId} no encontrado`);
    }

    const teamExistsInTournament = tournament.teams.some(
      (team) => team.id === teamId,
    );

    if (!teamExistsInTournament) {
      throw new NotFoundException(
        `El equipo #${teamId} no pertenece al torneo #${tournamentId}`,
      );
    }

    tournament.teams = tournament.teams.filter((team) => team.id !== teamId);

    return this.tournamentRepo.save(tournament);
  }
}

import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Tournament } from '../../domain/entities/tournament.entity';
import type { ITournamentRepository } from '../../domain/interfaces/tournament-repository.interface';

@Injectable()
export class RemoveTeamFromTournamentUseCase {
  constructor(
    @Inject('ITournamentRepository')
    private readonly tournamentRepo: ITournamentRepository,
  ) {}

  async execute(tournamentId: number, teamId: number): Promise<Tournament> {
    const tournament = await this.tournamentRepo.removeTeamFromTournament(
      tournamentId,
      teamId,
    );
    if (!tournament) {
      throw new NotFoundException(
        `Torneo con id ${tournamentId} no encontrado`,
      );
    }
    return tournament;
  }
}

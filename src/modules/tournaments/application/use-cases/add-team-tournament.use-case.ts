import { Inject, Injectable } from '@nestjs/common';
import { Tournament } from '../../domain/entities/tournament.entity';
import type { ITournamentRepository } from '../../domain/interfaces/tournament-repository.interface';

@Injectable()
export class AddTeamTournamentUseCase {
  constructor(
    @Inject('ITournamentRepository')
    private readonly tournamentRepo: ITournamentRepository,
  ) {}

  async execute(
    tournamentId: number,
    teamId: number,
  ): Promise<Tournament | null> {
    // TODO: validar que no se agreguen mas equipos de los establecidos (value-object)
    return await this.tournamentRepo.addTeamToTournament(tournamentId, teamId);
  }
}

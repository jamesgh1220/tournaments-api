import { Inject, Injectable } from '@nestjs/common';
import { Tournament } from 'src/modules/tournaments/domain/entities/tournament.entity';
import type { ITournamentRepository } from 'src/modules/tournaments/domain/interfaces/tournament-repository.interface';

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
    return await this.tournamentRepo.addTeamToTournament(tournamentId, teamId);
  }
}

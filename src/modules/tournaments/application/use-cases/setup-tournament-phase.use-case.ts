import { Inject, Injectable } from '@nestjs/common';
import { Match } from 'src/modules/matches/domain/entities/match.entity';
import type { ITournamentRepository } from '../../domain/interfaces/tournament-repository.interface';

@Injectable()
export class SetupTournamentPhaseUseCase {
  constructor(
    @Inject('ITournamentRepository')
    private readonly tournamentRepo: ITournamentRepository,
  ) {}

  // async execute(tournamentId: number, phaseId: number): Promise<Match[]> {
  //   // return await this.tournamentRepo.generateFixture(id, phaseId);
  // }
}

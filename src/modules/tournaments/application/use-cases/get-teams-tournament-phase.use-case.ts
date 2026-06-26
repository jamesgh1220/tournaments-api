import { Inject, Injectable } from '@nestjs/common';
// import type { ITeamRepository } from 'src/modules/teams/domain/interfaces/team-repository.interface';
import type { IPhaseRepository } from 'src/modules/phase/domain/interfaces/phase-repository.interface';
import type { ITournamentRepository } from '../../domain/interfaces/tournament-repository.interface';

@Injectable()
export class GetTeamsTournamentPhaseUseCase {
  constructor(
    // @Inject('ITeamRepository')
    // private readonly teamRepo: ITeamRepository,

    @Inject('IPhaseRepository')
    private readonly phaseRepo: IPhaseRepository,
    @Inject('ITournamentRepository')
    private readonly tournamentRepo: ITournamentRepository,
  ) {}

  async execute(tournamentId: number, phaseId: number) {
    const activePhase =
      await this.phaseRepo.findActiveByTournamentId(tournamentId);

    const type = activePhase?.type;
    if (type) {
      switch (type.name) {
        case 'LEAGUE':
          return { type, teams: await this.getTeamsOfLeague(tournamentId) };
          break;

        default:
          break;
      }
    }
  }

  async getTeamsOfLeague(tournamentId: number) {
    return await this.tournamentRepo.getTeamsOfTournamentLeague(tournamentId);
  }
}

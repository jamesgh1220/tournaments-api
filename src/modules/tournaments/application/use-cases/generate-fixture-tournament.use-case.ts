import { Injectable } from '@nestjs/common';
import { TournamentEngine } from '../../domain/services/tournament-engine';
import { Team } from 'src/modules/teams/domain/entities/teams.entity';

@Injectable()
export class GenerateFixtureTournamentPhaseUseCase {
  constructor() {}

  execute(phaseId: number, type: string, teams: Team[]) {
    const tournamentEngine = new TournamentEngine();
    return tournamentEngine.generateFixture(phaseId, type, teams);
  }
}

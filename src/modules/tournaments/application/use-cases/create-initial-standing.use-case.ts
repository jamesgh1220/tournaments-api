import { Inject, Injectable } from '@nestjs/common';
import { StandingService } from 'src/domain/standing/standings.service';
import { Standing } from 'src/modules/standings/domain/entities/standing.entity';
import type { IStandingRepository } from 'src/modules/standings/domain/interfaces/standing-repository.interface';
import { Team } from 'src/modules/teams/domain/entities/teams.entity';

@Injectable()
export class CreateInitialStandingUseCase {
  constructor(
    @Inject('IStandingRepository')
    private readonly standingRepo: IStandingRepository,
  ) {}

  async execute(
    tournamentId: number,
    phaseId: number,
    teams: Team[],
    groupId?: number,
  ) {
    const standingService = new StandingService();
    const initialStandings = standingService.phaseInitial(
      tournamentId,
      phaseId,
      teams,
      groupId,
    );

    return await this.standingRepo.createMany(initialStandings);
  }
}

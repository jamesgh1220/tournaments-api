import { Inject, Injectable } from '@nestjs/common';
import { Match } from 'src/modules/matches/domain/entities/match.entity';
import type { IMatchRepository } from 'src/modules/matches/domain/interfaces/match-repository.interface';

@Injectable()
export class SaveFixtureTournamentUseCase {
  constructor(
    @Inject('IMatchRepository')
    private readonly matchRepo: IMatchRepository,
  ) {}
  async execute(matches: Match[]) {
    return await this.matchRepo.createMany(matches);
  }
}

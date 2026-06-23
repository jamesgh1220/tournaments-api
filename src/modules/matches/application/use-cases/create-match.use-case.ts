import { Inject, Injectable } from '@nestjs/common';
import { MatchDto } from '../dto/match.dto';
import { Match } from '../../domain/entities/match.entity';
import type { IMatchRepository } from '../../domain/interfaces/match-repository.interface';

@Injectable()
export class CreateMatchUseCase {
  constructor(
    @Inject('IMatchRepository')
    private readonly matchRepo: IMatchRepository,
  ) {}

  async execute(dto: MatchDto): Promise<Match> {
    const match = Match.create(
      dto.homeScore,
      dto.awayScore,
      dto.status,
      dto.phaseId,
      dto.groupId,
      dto.homeTeamId,
      dto.awayTeamId,
    );
    const savedMatch = await this.matchRepo.create(match);
    return savedMatch;
  }
}

import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { MatchDto } from '../dto/match.dto';
import { Match } from '../../domain/entities/match.entity';
import type { IMatchRepository } from '../../domain/interfaces/match-repository.interface';

@Injectable()
export class UpdateMatchUseCase {
  constructor(
    @Inject('IMatchRepository')
    private readonly matchRepo: IMatchRepository,
  ) {}

  async execute(id: number, dto: MatchDto): Promise<Match> {
    const updated = await this.matchRepo.update(id, {
      homeScore: dto.homeScore,
      awayScore: dto.awayScore,
      status: dto.status,
      phaseId: dto.phaseId,
      groupId: dto.groupId,
      homeTeamId: dto.homeTeamId,
      awayTeamId: dto.awayTeamId,
    });
    if (!updated) {
      throw new NotFoundException(`Partido con id ${id} no encontrado`);
    }
    return updated;
  }
}

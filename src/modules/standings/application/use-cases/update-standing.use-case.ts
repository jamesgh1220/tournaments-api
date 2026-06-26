import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { StandingDto } from '../dto/standing.dto';
import { Standing } from '../../domain/entities/standing.entity';
import type { IStandingRepository } from '../../domain/interfaces/standing-repository.interface';

@Injectable()
export class UpdateStandingUseCase {
  constructor(
    @Inject('IStandingRepository')
    private readonly standingRepo: IStandingRepository,
  ) {}

  async execute(id: number, dto: StandingDto): Promise<Standing> {
    const updated = await this.standingRepo.update(id, {
      played: dto.played,
      wins: dto.wins,
      draws: dto.draws,
      losses: dto.losses,
      goalsFor: dto.goalsFor,
      goalsAgainst: dto.goalsAgainst,
      points: dto.points,
      tournamentId: dto.tournamentId,
      phaseId: dto.phaseId,
      groupId: dto.groupId,
      teamId: dto.teamId,
    });
    if (!updated) {
      throw new NotFoundException(`Standing con id ${id} no encontrado`);
    }
    return updated;
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { StandingDto } from '../dto/standing.dto';
import { Standing } from '../../domain/entities/standing.entity';
import type { IStandingRepository } from '../../domain/interfaces/standing-repository.interface';

@Injectable()
export class CreateStandingUseCase {
  constructor(
    @Inject('IStandingRepository')
    private readonly standingRepo: IStandingRepository,
  ) {}

  async execute(dto: StandingDto): Promise<Standing> {
    const standing = Standing.create(
      dto.played,
      dto.wins,
      dto.draws,
      dto.losses,
      dto.goalsFor,
      dto.goalsAgainst,
      dto.points,
      dto.tournamentId,
      dto.phaseId,
      dto.groupId,
      dto.teamId,
    );

    const savedStanding = await this.standingRepo.create(standing);
    return savedStanding;
  }
}

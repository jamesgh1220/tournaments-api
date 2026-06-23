import { Inject, Injectable } from '@nestjs/common';
import { CreatePhaseDto } from '../dto/phase.dto';
import { Phase } from '../../domain/entities/phase.entity';
import type { IPhaseRepository } from '../../domain/interfaces/phase-repository.interface';

@Injectable()
export class CreatePhaseUseCase {
  constructor(
    @Inject('IPhaseRepository')
    private readonly phaseRepo: IPhaseRepository,
  ) {}

  async execute(dto: CreatePhaseDto) {
    const phase = Phase.create(
      dto.name,
      dto.status,
      dto.order_number,
      dto.tournamentId,
      dto.typeId,
    );

    const savedPhase = await this.phaseRepo.create(phase);
    return savedPhase;
  }
}

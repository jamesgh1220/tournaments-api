import { Injectable } from '@nestjs/common';
import { CreatePhaseDto } from '../dto/phase.dto';
import { CreatePhaseUseCase } from '../use-cases/create-phase.use-case';
import { Phase } from '../../domain/entities/phase.entity';

@Injectable()
export class PhaseService {
  constructor(private readonly createPhaseUseCase: CreatePhaseUseCase) {}

  async create(dto: CreatePhaseDto): Promise<Phase | null> {
    return await this.createPhaseUseCase.execute(dto);
  }
}

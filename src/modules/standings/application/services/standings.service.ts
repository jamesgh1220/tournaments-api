import { Injectable } from '@nestjs/common';
import { StandingDto } from '../dto/standing.dto';
import { CreateStandingUseCase } from '../use-cases/create-standing.use-case';
import { UpdateStandingUseCase } from '../use-cases/update-standing.use-case';
import { DeleteStandingUseCase } from '../use-cases/delete-standing.use-case';
import { Standing } from '../../domain/entities/standing.entity';

@Injectable()
export class StandingsService {
  constructor(
    private readonly createStandingUseCase: CreateStandingUseCase,
    private readonly updateStandingUseCase: UpdateStandingUseCase,
    private readonly deleteStandingUseCase: DeleteStandingUseCase,
  ) {}

  async create(dto: StandingDto): Promise<Standing | null> {
    return await this.createStandingUseCase.execute(dto);
  }

  async update(id: number, dto: StandingDto): Promise<Standing | null> {
    return await this.updateStandingUseCase.execute(id, dto);
  }

  async remove(id: number): Promise<void> {
    await this.deleteStandingUseCase.execute(id);
  }
}

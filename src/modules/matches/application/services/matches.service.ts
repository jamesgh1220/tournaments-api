import { Injectable } from '@nestjs/common';
import { MatchDto } from '../dto/match.dto';
import { CreateMatchUseCase } from '../use-cases/create-match.use-case';
import { UpdateMatchUseCase } from '../use-cases/update-match.use-case';
import { DeleteMatchUseCase } from '../use-cases/delete-match.use-case';
import { FindByIdMatchUseCase } from '../use-cases/find-by-id-match.use-case';
import { FindMatchesUseCase } from '../use-cases/find-matches.use-case';
import { Match } from '../../domain/entities/match.entity';

@Injectable()
export class MatchesService {
  constructor(
    private readonly createMatchUseCase: CreateMatchUseCase,
    private readonly updateMatchUseCase: UpdateMatchUseCase,
    private readonly deleteMatchUseCase: DeleteMatchUseCase,
    private readonly findByIdMatchUseCase: FindByIdMatchUseCase,
    private readonly findMatchesUseCase: FindMatchesUseCase,
  ) {}

  async find(): Promise<Match[] | []> {
    return await this.findMatchesUseCase.execute();
  }

  async findById(id: number): Promise<Match | null> {
    return await this.findByIdMatchUseCase.execute(id);
  }

  async create(dto: MatchDto): Promise<Match | null> {
    return await this.createMatchUseCase.execute(dto);
  }

  async update(id: number, dto: MatchDto): Promise<Match | null> {
    return await this.updateMatchUseCase.execute(id, dto);
  }

  async remove(id: number): Promise<void> {
    await this.deleteMatchUseCase.execute(id);
  }
}

import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IMatchRepository } from '../../domain/interfaces/match-repository.interface';
import { Match } from '../../domain/entities/match.entity';

@Injectable()
export class FindByIdMatchUseCase {
  constructor(
    @Inject('IMatchRepository')
    private readonly matchRepo: IMatchRepository,
  ) {}

  async execute(id: number): Promise<Match> {
    const match = await this.matchRepo.findById(id);
    if (!match) {
      throw new NotFoundException(`Partido con id ${id} no encontrado`);
    }
    return match;
  }
}

import { Inject, Injectable } from '@nestjs/common';
import type { IMatchRepository } from '../../domain/interfaces/match-repository.interface';
import { Match } from '../../domain/entities/match.entity';

@Injectable()
export class FindByIdMatchUseCase {
  constructor(
    @Inject('IMatchRepository')
    private readonly matchRepo: IMatchRepository,
  ) {}

  async execute(id: number): Promise<Match | null> {
    const match = await this.matchRepo.findById(id);
    return match;
  }
}

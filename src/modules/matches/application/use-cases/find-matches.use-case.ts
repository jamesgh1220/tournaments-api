import { Inject, Injectable } from '@nestjs/common';
import type { IMatchRepository } from '../../domain/interfaces/match-repository.interface';
import { Match } from '../../domain/entities/match.entity';

@Injectable()
export class FindMatchesUseCase {
  constructor(
    @Inject('IMatchRepository')
    private readonly matchRepo: IMatchRepository,
  ) {}

  async execute(): Promise<Match[]> {
    const matches = await this.matchRepo.find();
    return matches;
  }
}

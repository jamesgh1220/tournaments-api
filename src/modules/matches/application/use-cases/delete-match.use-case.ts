import { Inject, Injectable } from '@nestjs/common';
import type { IMatchRepository } from '../../domain/interfaces/match-repository.interface';

@Injectable()
export class DeleteMatchUseCase {
  constructor(
    @Inject('IMatchRepository')
    private readonly matchRepo: IMatchRepository,
  ) {}

  async execute(id: number): Promise<void> {
    return await this.matchRepo.delete(id);
  }
}

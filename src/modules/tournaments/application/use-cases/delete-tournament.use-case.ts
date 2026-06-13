import { Inject, Injectable } from '@nestjs/common';
import type { ITournamentRepository } from '../../domain/interfaces/tournament-repository.interface';

@Injectable()
export class DeleteTournamentUseCase {
  constructor(
    @Inject('ITournamentRepository')
    private readonly tournamentRepo: ITournamentRepository,
  ) {}

  async execute(id: number): Promise<void> {
    return await this.tournamentRepo.delete(id);
  }
}

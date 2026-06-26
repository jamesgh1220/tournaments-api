import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { ITournamentRepository } from '../../domain/interfaces/tournament-repository.interface';
import { Tournament } from '../../domain/entities/tournament.entity';

@Injectable()
export class FindByIdTournamentUseCase {
  constructor(
    @Inject('ITournamentRepository')
    private readonly tournamentRepo: ITournamentRepository,
  ) {}

  async execute(id: number): Promise<Tournament> {
    const tournament = await this.tournamentRepo.findById(id);
    if (!tournament) {
      throw new NotFoundException(`Torneo con id ${id} no encontrado`);
    }
    return tournament;
  }
}

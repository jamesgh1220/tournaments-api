import { Inject, Injectable } from '@nestjs/common';
import type { ITournamentRepository } from '../../domain/interfaces/tournament-repository.interface';
import { Tournament } from '../../domain/entities/tournament.entity';

@Injectable()
export class FindTournamentsUseCase {
  constructor(
    @Inject('ITournamentRepository')
    private readonly tournamentRepo: ITournamentRepository,
  ) {}

  async execute(): Promise<Tournament[]> {
    const tournaments = await this.tournamentRepo.find();
    return tournaments;
  }
}

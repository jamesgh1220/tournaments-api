import { Inject, Injectable } from '@nestjs/common';
import { TournamentDto } from '../dto/tournament.dto';
import { Tournament } from '../../domain/entities/tournament.entity';
import type { ITournamentRepository } from '../../domain/interfaces/tournament-repository.interface';
import { Name } from '../../domain/value-objects/name.vo';
import { MatchDate } from '../../domain/value-objects/match-date.vo';

@Injectable()
export class UpdateTournamentUseCase {
  constructor(
    @Inject('ITournamentRepository')
    private readonly tournamentRepo: ITournamentRepository,
  ) {}

  async execute(id: number, dto: TournamentDto): Promise<Tournament | null> {
    const name = new Name(dto.name);
    const startDate = new MatchDate(new Date(dto.startDate));

    return await this.tournamentRepo.update(id, {
      name: name.value,
      state: dto.state,
      configuration: dto.configuration,
      startDate: startDate.value,
    });
  }
}

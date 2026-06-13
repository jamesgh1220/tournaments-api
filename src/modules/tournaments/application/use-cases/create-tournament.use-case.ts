import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { TournamentDto } from '../dto/tournament.dto';
import { Tournament } from '../../domain/entities/tournament.entity';
import type { ITournamentRepository } from '../../domain/interfaces/tournament-repository.interface';
import { Name } from '../../domain/value-objects/name.vo';
import { MatchDate } from '../../domain/value-objects/date.vo';

@Injectable()
export class CreateTournamentUseCase {
  constructor(
    @Inject('ITournamentRepository')
    private readonly tournamentRepo: ITournamentRepository,
  ) {}

  async execute(dto: TournamentDto): Promise<Tournament> {
    const name = new Name(dto.name);
    const startDate = new MatchDate(new Date(dto.startDate));

    const exists = await this.tournamentRepo.findByName(dto.name);
    if (exists) {
      throw new ConflictException('Ya existe un torneo con ese nombre.');
    }

    const tournament = Tournament.create(
      name.value,
      dto.state,
      dto.configuration,
      startDate.value,
    );

    const savedTournament = await this.tournamentRepo.create(tournament);
    return savedTournament;
  }
}

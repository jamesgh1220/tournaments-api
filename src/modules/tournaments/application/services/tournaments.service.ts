import { Injectable } from '@nestjs/common';
import { TournamentDto } from '../dto/tournament.dto';
import { CreateTournamentUseCase } from '../use-cases/create-tournament.use-case';
import { Tournament } from '../../domain/entities/tournament.entity';
import { UpdateTournamentUseCase } from '../use-cases/update-tournament.use-case';
import { FindTournamentsUseCase } from '../use-cases/find-tournaments.use-case';
import { FindByIdTournamentUseCase } from '../use-cases/find-by-id-tournament.use-case';
import { DeleteTournamentUseCase } from '../use-cases/delete-tournament.use-case';
import { AddTeamTournamentUseCase } from './../use-cases/add-team-tournament.use-case';
import { RemoveTeamFromTournamentUseCase } from './../use-cases/remove-team-from-tournament.use-case';
import { GetTeamsTournamentPhaseUseCase } from './../use-cases/get-teams-tournament-phase.use-case';
import { GenerateFixtureTournamentPhaseUseCase } from '../use-cases/generate-fixture-tournament.use-case';
import { SaveFixtureTournamentUseCase } from '../use-cases/save-fixture-tournament.use-case';
// import { TournamentEngine } from '../../domain/services/tournament-engine';

@Injectable()
export class TournamentsService {
  constructor(
    private readonly findTournamentsUseCase: FindTournamentsUseCase,
    private readonly createTournamentUseCase: CreateTournamentUseCase,
    private readonly updateTournamentUseCase: UpdateTournamentUseCase,
    private readonly findByIdTournamentUseCase: FindByIdTournamentUseCase,
    private readonly deleteTournamentUseCase: DeleteTournamentUseCase,
    private readonly addTeamTournamentUseCase: AddTeamTournamentUseCase,
    private readonly removeTeamFromTournamentUseCase: RemoveTeamFromTournamentUseCase,
    private readonly getTeamsTournamentPhaseUseCase: GetTeamsTournamentPhaseUseCase,
    private readonly generateFixtureTournamentPhaseUseCase: GenerateFixtureTournamentPhaseUseCase,
    private readonly saveFixtureTournamentUseCase: SaveFixtureTournamentUseCase,
  ) {}

  async find(): Promise<Tournament[] | []> {
    return await this.findTournamentsUseCase.execute();
  }

  async findById(id: number): Promise<Tournament | null> {
    return await this.findByIdTournamentUseCase.execute(id);
  }

  async create(dto: TournamentDto): Promise<Tournament | null> {
    return await this.createTournamentUseCase.execute(dto);
  }

  async update(id: number, dto: TournamentDto): Promise<Tournament | null> {
    return await this.updateTournamentUseCase.execute(id, dto);
  }

  async remove(id: number): Promise<void> {
    await this.deleteTournamentUseCase.execute(id);
  }

  async addTeamToTournament(
    tournamentId: number,
    teamId: number,
  ): Promise<Tournament | null> {
    return await this.addTeamTournamentUseCase.execute(tournamentId, teamId);
  }

  async removeTeamFromTournament(
    tournamentId: number,
    teamId: number,
  ): Promise<Tournament | null> {
    return await this.removeTeamFromTournamentUseCase.execute(
      tournamentId,
      teamId,
    );
  }

  async generateFixture(tournamentId: number, phaseId: number) {
    const teamsOfActivePhase =
      await this.getTeamsTournamentPhaseUseCase.execute(tournamentId, phaseId);

    if (teamsOfActivePhase) {
      const matches = this.generateFixtureTournamentPhaseUseCase.execute(
        phaseId,
        teamsOfActivePhase.type.name,
        teamsOfActivePhase.teams,
      );

      return await this.saveFixtureTournamentUseCase.execute(matches.matches);
    }

    return [];
  }
}

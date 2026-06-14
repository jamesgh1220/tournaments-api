import { Injectable } from '@nestjs/common';
import { TournamentDto } from '../dto/tournament.dto';
import { CreateTournamentUseCase } from '../use-cases/create-tournament.use-case';
import { Tournament } from '../../domain/entities/tournament.entity';
import { UpdateTournamentUseCase } from '../use-cases/update-tournament.use-case';
import { FindTournamentsUseCase } from '../use-cases/find-tournaments.use-case';
import { FindByIdTournamentUseCase } from '../use-cases/find-by-id-tournament.use-case';
import { DeleteTournamentUseCase } from '../use-cases/delete-tournament.use-case';
import { AddTeamTournamentUseCase } from 'src/modules/tournaments/application/use-cases/add-team-tournament.use-case';
import { RemoveTeamTournamentUseCase } from '../use-cases/remove-team-tournament.use-case';

@Injectable()
export class TournamentsService {
  constructor(
    private readonly findTournamentsUseCase: FindTournamentsUseCase,
    private readonly createTournamentUseCase: CreateTournamentUseCase,
    private readonly updateTournamentUseCase: UpdateTournamentUseCase,
    private readonly findByIdTournamentUseCase: FindByIdTournamentUseCase,
    private readonly deleteTournamentUseCase: DeleteTournamentUseCase,
    private readonly addTeamTournamentUseCase: AddTeamTournamentUseCase,
    private readonly removeTeamTournamentUseCase: RemoveTeamTournamentUseCase,
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

  async removeTeamToTournament(
    tournamentId: number,
    teamId: number,
  ): Promise<Tournament | null> {
    return await this.removeTeamTournamentUseCase.execute(tournamentId, teamId);
  }

  // async removeTeamToTournament(
  //   tournamentId: number,
  //   teamId: number,
  // ): Promise<Tournament> {
  //   const tournament = await this.tournamentRepo.findOne({
  //     where: { id: tournamentId },
  //     relations: {
  //       teams: true,
  //     },
  //   });

  //   if (!tournament) {
  //     throw new NotFoundException(`Torneo #${tournamentId} no encontrado`);
  //   }

  //   const teamExistsInTournament = tournament.teams.some(
  //     (team) => team.id === teamId,
  //   );

  //   if (!teamExistsInTournament) {
  //     throw new NotFoundException(
  //       `El equipo #${teamId} no pertenece al torneo #${tournamentId}`,
  //     );
  //   }

  //   tournament.teams = tournament.teams.filter((team) => team.id !== teamId);

  //   return this.tournamentRepo.save(tournament);
  // }

  // async generateFixture(id: number): Promise<Tournament> {
  //   const tournamentEngine = new TournamentEngine();
  //   const tournamentId = id;
  //   const tournament = await this.tournamentRepo.findOne({
  //     where: { id: tournamentId },
  //     relations: {
  //       teams: true,
  //     },
  //   });

  //   if (!tournament)
  //     throw new NotFoundException(`Torneo #${tournamentId} no encontrado`);

  //   const fixture: Fixture = tournamentEngine.generateFixture(
  //     tournament.configuration,
  //     tournament.teams,
  //   );

  //   for (let index = 0; index < fixture.matches.length; index++) {
  //     const match = fixture.matches[index];
  //     await this.matchesService.create({
  //       phaseId: 2,
  //       homeTeamId: match.homeTeam,
  //       awayTeamId: match.awayTeam,
  //       homeScore: 0,
  //       awayScore: 0,
  //       scheduledAt: '2026-06-11',
  //     });
  //   }

  //   return tournament;
  // }
}

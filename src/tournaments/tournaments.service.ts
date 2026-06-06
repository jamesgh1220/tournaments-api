import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tournament } from './entities/tournament.entity';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { Team } from 'src/teams/entities/teams.entity';
import { TournamentEngine } from 'src/domain/services/tournament-engine';
import { MatchesService } from 'src/matches/matches.service';
import { Fixture } from 'src/interfaces/fixture/match-fixture';

@Injectable()
export class TournamentsService {
  constructor(
    @InjectRepository(Tournament)
    private tournamentRepo: Repository<Tournament>,
    @InjectRepository(Team)
    private teamRepo: Repository<Team>,

    private readonly matchesService: MatchesService,
  ) {}

  findAll(): Promise<Tournament[]> {
    return this.tournamentRepo.find();
  }

  async findOne(id: number): Promise<Tournament> {
    const tournament = await this.tournamentRepo.findOneBy({ id });
    if (!tournament) throw new NotFoundException(`Torneo #${id} no encontrado`);
    return tournament;
  }

  async create(data: CreateTournamentDto): Promise<Tournament> {
    const tournamentExists = await this.tournamentRepo.findOne({
      where: {
        name: data.name,
      },
    });

    if (tournamentExists) {
      throw new BadRequestException(
        'A tournament with that name already exists',
      );
    }

    const tournament = this.tournamentRepo.create(data);
    return this.tournamentRepo.save(tournament);
  }

  async update(id: number, data: Partial<Tournament>): Promise<Tournament> {
    await this.tournamentRepo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const tournament = await this.findOne(id);
    await this.tournamentRepo.remove(tournament);
  }

  async addTeamToTournament(
    tournamentId: number,
    teamId: number,
  ): Promise<Tournament> {
    const tournament = await this.tournamentRepo.findOne({
      where: { id: tournamentId },
      relations: {
        teams: true,
      },
    });

    const team = await this.teamRepo.findOneBy({ id: teamId });

    if (!team || !tournament)
      throw new NotFoundException(
        `Torneo #${tournamentId} o Equipo #${teamId} no encontrado`,
      );

    tournament.teams.push(team);
    return this.tournamentRepo.save(tournament);
  }

  async removeTeamToTournament(
    tournamentId: number,
    teamId: number,
  ): Promise<Tournament> {
    const tournament = await this.tournamentRepo.findOne({
      where: { id: tournamentId },
      relations: {
        teams: true,
      },
    });

    if (!tournament) {
      throw new NotFoundException(`Torneo #${tournamentId} no encontrado`);
    }

    const teamExistsInTournament = tournament.teams.some(
      (team) => team.id === teamId,
    );

    if (!teamExistsInTournament) {
      throw new NotFoundException(
        `El equipo #${teamId} no pertenece al torneo #${tournamentId}`,
      );
    }

    tournament.teams = tournament.teams.filter((team) => team.id !== teamId);

    return this.tournamentRepo.save(tournament);
  }

  async generateFixture(id: number): Promise<Tournament> {
    const tournamentEngine = new TournamentEngine();
    const tournamentId = id;
    const tournament = await this.tournamentRepo.findOne({
      where: { id: tournamentId },
      relations: {
        teams: true,
      },
    });

    if (!tournament)
      throw new NotFoundException(`Torneo #${tournamentId} no encontrado`);

    const fixture: Fixture = tournamentEngine.generateFixture(
      tournament.configuration,
      tournament.teams,
    );

    for (let index = 0; index < fixture.matches.length; index++) {
      const match = fixture.matches[index];
      await this.matchesService.create({
        phaseId: 2,
        homeTeamId: match.homeTeam,
        awayTeamId: match.awayTeam,
        homeScore: 0,
        awayScore: 0,
        scheduledAt: '2026-06-11',
      });
    }

    return tournament;
  }
}

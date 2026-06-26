import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TournamentOrmEntity } from './infrastructure/persistence/tournament.orm-entity';
import { TournamentsService } from './application/services/tournaments.service';
import { TournamentsController } from './infrastructure/http/tournaments.controller';
import { TeamOrmEntity } from 'src/modules/teams/infrastructure/persistence/team.orm-entity';
import { MatchesModule } from 'src/modules/matches/matches.module';
import { TournamentRepository } from './infrastructure/persistence/tournament.repository';
import { CreateTournamentUseCase } from './application/use-cases/create-tournament.use-case';
import { UpdateTournamentUseCase } from './application/use-cases/update-tournament.use-case';
import { FindTournamentsUseCase } from './application/use-cases/find-tournaments.use-case';
import { FindByIdTournamentUseCase } from './application/use-cases/find-by-id-tournament.use-case';
import { DeleteTournamentUseCase } from './application/use-cases/delete-tournament.use-case';
import { AddTeamTournamentUseCase } from './application/use-cases/add-team-tournament.use-case';
import { RemoveTeamFromTournamentUseCase } from './application/use-cases/remove-team-from-tournament.use-case';
import { GetTeamsTournamentPhaseUseCase } from './application/use-cases/get-teams-tournament-phase.use-case';
import { SetupTournamentPhaseUseCase } from './application/use-cases/setup-tournament-phase.use-case';
import { PhaseRepository } from '../phase/infrastructure/persistence/phase.repository';
import { PhaseOrmEntity } from '../phase/infrastructure/persistence/phase.orm-entity';
import { GenerateFixtureTournamentPhaseUseCase } from './application/use-cases/generate-fixture-tournament.use-case';
import { SaveFixtureTournamentUseCase } from './application/use-cases/save-fixture-tournament.use-case';
import { MatchRepository } from '../matches/infrastructure/persistence/match.repository';
import { MatchOrmEntity } from '../matches/infrastructure/persistence/match.orm-entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TournamentOrmEntity,
      TeamOrmEntity,
      PhaseOrmEntity,
      MatchOrmEntity,
    ]),
    MatchesModule,
  ],
  providers: [
    TournamentsService,
    FindTournamentsUseCase,
    FindByIdTournamentUseCase,
    CreateTournamentUseCase,
    UpdateTournamentUseCase,
    DeleteTournamentUseCase,
    AddTeamTournamentUseCase,
    RemoveTeamFromTournamentUseCase,
    SetupTournamentPhaseUseCase,
    GetTeamsTournamentPhaseUseCase,
    GenerateFixtureTournamentPhaseUseCase,
    SaveFixtureTournamentUseCase,
    {
      provide: 'ITournamentRepository',
      useClass: TournamentRepository,
    },
    {
      provide: 'IPhaseRepository',
      useClass: PhaseRepository,
    },
    {
      provide: 'IMatchRepository',
      useClass: MatchRepository,
    },
  ],
  controllers: [TournamentsController],
})
export class TournamentsModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TournamentOrmEntity } from './infrastructure/persistence/tournament.orm-entity';
import { TournamentsService } from './application/services/tournaments.service';
import { TournamentsController } from './infrastructure/http/tournaments.controller';
import { TeamOrmEntity } from 'src/modules/teams/infrastructure/persistence/team.orm-entity';
import { MatchesModule } from 'src/matches/matches.module';
import { TournamentRepository } from './infrastructure/persistence/tournament.repository';
import { CreateTournamentUseCase } from './application/use-cases/create-tournament.use-case';
import { UpdateTournamentUseCase } from './application/use-cases/update-tournament.use-case';
import { FindTournamentsUseCase } from './application/use-cases/find-tournaments.use-case';
import { FindByIdTournamentUseCase } from './application/use-cases/find-by-id-tournament.use-case';
import { DeleteTournamentUseCase } from './application/use-cases/delete-tournament.use-case';
import { AddTeamTournamentUseCase } from './application/use-cases/add-team-tournament.use-case';
import { RemoveTeamFromTournamentUseCase } from './application/use-cases/remove-team-from-tournament.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([TournamentOrmEntity, TeamOrmEntity]), MatchesModule],
  providers: [
    TournamentsService,
    FindTournamentsUseCase,
    FindByIdTournamentUseCase,
    CreateTournamentUseCase,
    UpdateTournamentUseCase,
    DeleteTournamentUseCase,
    AddTeamTournamentUseCase,
    RemoveTeamFromTournamentUseCase,
    {
      provide: 'ITournamentRepository',
      useClass: TournamentRepository,
    },
  ],
  controllers: [TournamentsController],
})
export class TournamentsModule {}

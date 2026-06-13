import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tournament } from './domain/entities/tournament.entity';
import { TournamentsService } from './application/services/tournaments.service';
import { TournamentsController } from './infrastructure/http/tournaments.controller';
import { Team } from 'src/teams/entities/teams.entity';
import { MatchesModule } from 'src/matches/matches.module';
import { TournamentRepository } from './infrastructure/persistence/tournament.repository';
import { CreateTournamentUseCase } from './application/use-cases/create-tournament.use-case';
import { UpdateTournamentUseCase } from './application/use-cases/update-tournament.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([Tournament, Team]), MatchesModule],
  providers: [
    TournamentsService,
    CreateTournamentUseCase,
    UpdateTournamentUseCase,
    {
      provide: 'ITournamentRepository',
      useClass: TournamentRepository,
    },
  ],
  controllers: [TournamentsController],
})
export class TournamentsModule {}

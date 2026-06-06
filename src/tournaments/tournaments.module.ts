import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tournament } from './entities/tournament.entity';
import { TournamentsService } from './tournaments.service';
import { TournamentsController } from './tournaments.controller';
import { Team } from 'src/teams/entities/teams.entity';
import { MatchesModule } from 'src/matches/matches.module';

@Module({
  imports: [TypeOrmModule.forFeature([Tournament, Team]), MatchesModule],
  providers: [TournamentsService],
  controllers: [TournamentsController],
})
export class TournamentsModule {}

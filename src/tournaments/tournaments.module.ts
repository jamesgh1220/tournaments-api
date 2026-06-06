import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tournament } from './entities/tournament.entity';
import { TournamentsService } from './tournaments.service';
import { TournamentsController } from './tournaments.controller';
import { Team } from 'src/teams/entities/teams.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tournament, Team])],
  providers: [TournamentsService],
  controllers: [TournamentsController],
})
export class TournamentsModule {}

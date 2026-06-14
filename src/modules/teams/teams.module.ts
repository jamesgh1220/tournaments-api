import { Module } from '@nestjs/common';
import { TeamsController } from './infrastructure/http/teams.controller';
import { TeamsService } from './application/services/teams.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from './domain/entities/teams.entity';
import { TeamRepository } from './infrastructure/persistence/team.repository';
import { CreateTeamUseCase } from './application/use-cases/create-team.use-case';
import { DeleteTeamUseCase } from './application/use-cases/delete-team.use-case';
import { FindByIdTeamtUseCase } from './application/use-cases/find-by-id-team.use-case';
import { FindTeamsUseCase } from './application/use-cases/find-teams.use-case';
import { UpdateTeamUseCase } from './application/use-cases/update-team.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([Team])],
  controllers: [TeamsController],
  providers: [
    CreateTeamUseCase,
    DeleteTeamUseCase,
    UpdateTeamUseCase,
    FindTeamsUseCase,
    FindByIdTeamtUseCase,
    TeamsService,
    {
      provide: 'ITeamRepository',
      useClass: TeamRepository,
    },
  ],
})
export class TeamsModule {}

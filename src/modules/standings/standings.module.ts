import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StandingsService } from './application/services/standings.service';
import { StandingsController } from './infrastructure/http/standings.controller';
import { CreateStandingUseCase } from './application/use-cases/create-standing.use-case';
import { UpdateStandingUseCase } from './application/use-cases/update-standing.use-case';
import { DeleteStandingUseCase } from './application/use-cases/delete-standing.use-case';
import { StandingRepository } from './infrastructure/persistence/standing.repository';
import { StandingOrmEntity } from './infrastructure/persistence/standing.orm-entity';

@Module({
  imports: [TypeOrmModule.forFeature([StandingOrmEntity])],
  providers: [
    StandingsService,
    CreateStandingUseCase,
    UpdateStandingUseCase,
    DeleteStandingUseCase,
    {
      provide: 'IStandingRepository',
      useClass: StandingRepository,
    },
  ],
  controllers: [StandingsController],
})
export class StandingsModule {}

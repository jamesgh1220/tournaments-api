import { Module } from '@nestjs/common';
import { PhaseService } from './application/services/phase.service';
import { PhaseController } from './infrastructure/http/phase.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreatePhaseUseCase } from './application/use-cases/create-phase.use-case';
import { PhaseRepository } from './infrastructure/persistence/phase.repository';
import { PhaseOrmEntity } from './infrastructure/persistence/phase.orm-entity';

@Module({
  imports: [TypeOrmModule.forFeature([PhaseOrmEntity])],
  providers: [
    PhaseService,
    CreatePhaseUseCase,
    {
      provide: 'IPhaseRepository',
      useClass: PhaseRepository,
    },
  ],
  controllers: [PhaseController],
  exports: [TypeOrmModule.forFeature([PhaseOrmEntity])],
})
export class PhaseModule {}

import { Module } from '@nestjs/common';
import { MatchesService } from './application/services/matches.service';
import { MatchesController } from './infrastructure/http/matches.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhaseModule } from 'src/modules/phase/phase.module';
import { MatchOrmEntity } from './infrastructure/persistence/match.orm-entity';
import { MatchRepository } from './infrastructure/persistence/match.repository';
import { CreateMatchUseCase } from './application/use-cases/create-match.use-case';
import { UpdateMatchUseCase } from './application/use-cases/update-match.use-case';
import { DeleteMatchUseCase } from './application/use-cases/delete-match.use-case';
import { FindByIdMatchUseCase } from './application/use-cases/find-by-id-match.use-case';
import { FindMatchesUseCase } from './application/use-cases/find-matches.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([MatchOrmEntity]), PhaseModule],
  providers: [
    MatchesService,
    CreateMatchUseCase,
    UpdateMatchUseCase,
    DeleteMatchUseCase,
    FindByIdMatchUseCase,
    FindMatchesUseCase,
    {
      provide: 'IMatchRepository',
      useClass: MatchRepository,
    },
  ],
  controllers: [MatchesController],
})
export class MatchesModule {}

import { Module } from '@nestjs/common';
import { PhaseService } from './phase.service';
import { PhaseController } from './phase.controller';

@Module({
  providers: [PhaseService],
  controllers: [PhaseController]
})
export class PhaseModule {}

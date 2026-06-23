import {
  Controller,
  UseGuards,
  Body,
  Post,
  // Delete,
  // Get,
  // Patch,
  // Param,
} from '@nestjs/common';
import { JwtAuthGuard } from 'common/guards/jwt-auth-guard';
import { PhaseService } from '../../application/services/phase.service';
import { CreatePhaseDto } from '../../application/dto/phase.dto';

@UseGuards(JwtAuthGuard)
@Controller('phases')
export class PhaseController {
  constructor(private readonly phaseService: PhaseService) {}

  // @Get()
  // findAll() {
  //   return this.phaseService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.phaseService.findOne(+id);
  // }

  @Post()
  create(@Body() dto: CreatePhaseDto) {
    return this.phaseService.create(dto);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() dto: CreatePhaseDto) {
  //   return this.phaseService.update(+id, dto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.phaseService.remove(+id);
  // }
}

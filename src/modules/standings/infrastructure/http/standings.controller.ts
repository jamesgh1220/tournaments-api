import {
  Controller,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from 'common/guards/jwt-auth-guard';
import { StandingsService } from '../../application/services/standings.service';
import { StandingDto } from '../../application/dto/standing.dto';

@UseGuards(JwtAuthGuard)
@Controller('standings')
export class StandingsController {
  constructor(private readonly standingService: StandingsService) {}

  @Post()
  create(@Body() dto: StandingDto) {
    return this.standingService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: StandingDto) {
    return this.standingService.update(+id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: number) {
    return this.standingService.remove(+id);
  }
}

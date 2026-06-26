import {
  Controller,
  Get,
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
import { MatchesService } from '../../application/services/matches.service';
import { MatchDto } from '../../application/dto/match.dto';

@UseGuards(JwtAuthGuard)
@Controller('matches')
export class MatchesController {
  constructor(private readonly matchService: MatchesService) {}

  @Get()
  findAll() {
    return this.matchService.find();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.matchService.findById(+id);
  }

  @Post()
  create(@Body() dto: MatchDto) {
    return this.matchService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: MatchDto) {
    return this.matchService.update(+id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: number) {
    return this.matchService.remove(+id);
  }
}

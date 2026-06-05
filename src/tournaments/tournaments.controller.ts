import { Controller, UseGuards, Body, Post } from '@nestjs/common';
import { JwtAuthGuard } from 'common/guards/jwt-auth-guard';
import { IsString, IsNumber } from 'class-validator';
import { TournamentsService } from './tournaments.service';
TournamentsService

class CreateDto {
  @IsString() name: string;
  @IsNumber() quantity_teams: number;
  @IsNumber() qualified_teams: number;
}

// @UseGuards(JwtAuthGuard)
@Controller('tournaments')
export class TournamentsController {
  constructor(private readonly tournamentService: TournamentsService) {}

  @Post()
  create(@Body() dto: CreateDto) {
    return this.tournamentService.create(dto);
  }
}

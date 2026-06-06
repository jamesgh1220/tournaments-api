import {
  Controller,
  UseGuards,
  Body,
  Post,
  Delete,
  Get,
  Patch,
  Param,
} from '@nestjs/common';
import { JwtAuthGuard } from 'common/guards/jwt-auth-guard';
import { TournamentsService } from './tournaments.service';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { HandleTeamToTournamentDto } from './dto/add-team-to-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';

@UseGuards(JwtAuthGuard)
@Controller('tournaments')
export class TournamentsController {
  constructor(private readonly tournamentService: TournamentsService) {}

  @Get()
  findAll() {
    return this.tournamentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tournamentService.findOne(+id);
  }

  @Post()
  create(@Body() dto: CreateTournamentDto) {
    return this.tournamentService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTournamentDto) {
    return this.tournamentService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tournamentService.remove(+id);
  }

  @Post('add-team')
  addTeamToTournament(@Body() dto: HandleTeamToTournamentDto) {
    return this.tournamentService.addTeamToTournament(
      dto.tournamentId,
      dto.teamId,
    );
  }

  @Delete('remove-team')
  removeTeamToTournament(@Body() dto: HandleTeamToTournamentDto) {
    return this.tournamentService.removeTeamToTournament(
      dto.tournamentId,
      dto.teamId,
    );
  }
}

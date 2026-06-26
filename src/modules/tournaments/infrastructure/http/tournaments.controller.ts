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
import { TournamentsService } from '../../application/services/tournaments.service';
import { TournamentDto } from '../../application/dto/tournament.dto';

@UseGuards(JwtAuthGuard)
@Controller('tournaments')
export class TournamentsController {
  constructor(private readonly tournamentService: TournamentsService) {}

  @Post()
  create(@Body() dto: TournamentDto) {
    return this.tournamentService.create(dto);
  }

  @Get()
  findAll() {
    return this.tournamentService.find();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.tournamentService.findById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: TournamentDto) {
    return this.tournamentService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.tournamentService.remove(+id);
  }

  @Post(':id/teams')
  addTeamToTournament(@Param('id') id: number, @Body('teamId') teamId: number) {
    return this.tournamentService.addTeamToTournament(+id, +teamId);
  }

  @Delete(':id/teams/:teamId')
  removeTeamFromTournament(
    @Param('id') id: number,
    @Param('teamId') teamId: number,
  ) {
    return this.tournamentService.removeTeamFromTournament(+id, +teamId);
  }

  @Post(':id/phases/:phaseId/generate-fixture')
  generateFixture(@Param('id') id: number, @Param('phaseId') phaseId: number) {
    return this.tournamentService.generateFixture(+id, +phaseId);
  }
}

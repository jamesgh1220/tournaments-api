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
  findOne(@Param('id') id: string) {
    return this.tournamentService.findById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: TournamentDto) {
    return this.tournamentService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tournamentService.remove(+id);
  }

  // @Post('add-team')
  // addTeamToTournament(@Body() dto: HandleTeamToTournamentDto) {
  //   return this.tournamentService.addTeamToTournament(
  //     dto.tournamentId,
  //     dto.teamId,
  //   );
  // }

  // @Delete('remove-team')
  // removeTeamToTournament(@Body() dto: HandleTeamToTournamentDto) {
  //   return this.tournamentService.removeTeamToTournament(
  //     dto.tournamentId,
  //     dto.teamId,
  //   );
  // }

  // @Post(':id/generate-fixture')
  // generateFixture(@Param('id') id: number) {
  //   return this.tournamentService.generateFixture(id);
  // }
}

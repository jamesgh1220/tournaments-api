import { IsNumber } from 'class-validator';

export class HandleTeamToTournamentDto {
  @IsNumber()
  tournamentId: number;

  @IsNumber()
  teamId: number;
}

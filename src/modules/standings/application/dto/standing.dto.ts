import { IsInt, IsOptional, IsPositive } from 'class-validator';

export class StandingDto {
  @IsInt()
  @IsPositive()
  played: number;

  @IsInt()
  @IsPositive()
  wins: number;

  @IsInt()
  @IsPositive()
  draws: number;

  @IsInt()
  @IsPositive()
  losses: number;

  @IsOptional()
  @IsInt()
  goalsFor: number;

  @IsOptional()
  @IsInt()
  goalsAgainst: number;

  @IsOptional()
  @IsInt()
  points: number;

  @IsOptional()
  @IsInt()
  tournamentId: number;

  @IsOptional()
  @IsInt()
  phaseId: number;

  @IsOptional()
  @IsInt()
  groupId: number;

  @IsOptional()
  @IsInt()
  teamId: number;
}

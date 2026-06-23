import {
  IsDateString,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  IsIn,
} from 'class-validator';

export class MatchDto {
  @IsInt()
  @IsPositive()
  phaseId: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  groupId: number;

  @IsInt()
  @IsPositive()
  homeTeamId: number;

  @IsInt()
  @IsPositive()
  awayTeamId: number;

  @IsOptional()
  @IsInt()
  homeScore: number;

  @IsOptional()
  @IsInt()
  awayScore: number;

  @IsString()
  @IsIn(['TO_COME', 'FINISHED'])
  status: string;

  @IsDateString()
  scheduledAt: string;
}

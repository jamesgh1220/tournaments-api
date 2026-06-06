import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsIn,
  IsInt,
  Min,
  IsPositive,
} from 'class-validator';

export class CreatePhaseDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsIn(['TO_COME', 'IN_PROGRESS', 'FINISHED'])
  status: string;

  @IsInt()
  @Min(1)
  order_number: number;

  @IsInt()
  @IsPositive()
  tournamentId: number;

  @IsInt()
  @IsPositive()
  typeId: number;
}

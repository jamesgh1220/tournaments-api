import {
  IsString, IsEmail,
  MinLength, IsInt, Min
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsEmail()
  email: string;

  @IsInt()
  @Min(18)
  age: number;
}
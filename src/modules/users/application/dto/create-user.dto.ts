import {
  IsString,
  IsEmail,
  MinLength,
  IsIn,
  IsNotEmpty,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['team', 'admin'])
  role?: string;
}

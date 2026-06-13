import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AuthUserDto {
  @IsString()
  @MinLength(2)
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  role: string;
}

import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { UsersService } from '../../application/services/user.service';
import { AuthUserDto } from '../../application/dto/auth-user.dto';
import { LoginDto } from '../../application/dto/login.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  register(@Body() dto: AuthUserDto) {
    return this.usersService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.usersService.login(dto);
  }
}

import { Injectable } from '@nestjs/common';
import { AuthUserDto } from '../dto/auth-user.dto';
import { LoginDto } from '../dto/login.dto';
import { RegisterUserUseCase } from '../use-cases/register-user.use-case';
import {
  LoginUserUseCase,
  TokenResponse,
} from '../use-cases/login-user.use-case';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUseCase: LoginUserUseCase,
  ) {}

  register(dto: AuthUserDto): Promise<Omit<User, 'password'>> {
    return this.registerUserUseCase.execute(dto);
  }

  login(dto: LoginDto): Promise<TokenResponse> {
    return this.loginUseCase.execute(dto);
  }
}

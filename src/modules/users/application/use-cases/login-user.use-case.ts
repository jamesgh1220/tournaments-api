import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../dto/login.dto';
import type { IUserRepository } from '../../domain/interfaces/user.repository.interface';
import { Email } from '../../domain/value-objects/email.vo';

export interface TokenResponse {
  accessToken: string;
  user: any;
}

@Injectable()
export class LoginUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepo: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(dto: LoginDto): Promise<TokenResponse> {
    const email = new Email(dto.email);
    const user = await this.userRepo.findByEmail(email.value);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const validPassword = await bcrypt.compare(dto.password, user.password);
    if (!validPassword) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = {
      sub: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    const accessToken = this.jwtService.sign(payload);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;

    return { accessToken, user: userWithoutPassword };
  }
}

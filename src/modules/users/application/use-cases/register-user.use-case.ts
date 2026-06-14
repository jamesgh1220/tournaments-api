import { ConflictException, Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthUserDto } from '../dto/auth-user.dto';
import { User } from '../../domain/entities/user.entity';
import type { IUserRepository } from '../../domain/interfaces/user.repository.interface';
import { Email } from '../../domain/value-objects/email.vo';
import { Password } from '../../domain/value-objects/password.vo';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepo: IUserRepository,
  ) {}

  async execute(dto: AuthUserDto): Promise<Omit<User, 'password'>> {
    const email = new Email(dto.email);
    const password = new Password(dto.password);

    const exists = await this.userRepo.findByEmail(email.value);

    if (exists) {
      throw new ConflictException('Ya existe un usuario con ese email');
    }

    const passwordHash = await bcrypt.hash(password.value, 10);

    const user = User.create(dto.name, email.value, passwordHash, dto.role);

    const savedUser = await this.userRepo.create(user);

    const { password: _, ...result } = savedUser;

    return result;
  }
}

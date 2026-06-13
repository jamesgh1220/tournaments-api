import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../domain/entities/user.entity';
import type { IUserRepository } from '../../domain/interfaces/user.repository.interface';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  create(user: User): Promise<User> {
    return this.userRepo.save(user);
  }
  findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }
  async findById(id: number): Promise<User | null> {
    return this.userRepo.findOne({ where: { id } });
  }
}

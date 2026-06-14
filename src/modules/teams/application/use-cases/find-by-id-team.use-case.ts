import { Inject, Injectable } from '@nestjs/common';
import type { ITeamRepository } from '../../domain/interfaces/team-repository.interface';
import { Team } from '../../domain/entities/teams.entity';

@Injectable()
export class FindByIdTeamtUseCase {
  constructor(
    @Inject('ITeamRepository')
    private readonly teamRepo: ITeamRepository,
  ) {}

  async execute(id: number): Promise<Team | null> {
    const team = await this.teamRepo.findById(id);
    return team;
  }
}

import { Inject, Injectable } from '@nestjs/common';
import type { ITeamRepository } from '../../domain/interfaces/team-repository.interface';
import { Team } from '../../domain/entities/teams.entity';

@Injectable()
export class FindTeamsUseCase {
  constructor(
    @Inject('ITeamRepository')
    private readonly teamRepo: ITeamRepository,
  ) {}

  async execute(): Promise<Team[]> {
    const teams = await this.teamRepo.find();
    return teams;
  }
}

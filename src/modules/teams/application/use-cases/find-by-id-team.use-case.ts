import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { ITeamRepository } from '../../domain/interfaces/team-repository.interface';
import { Team } from '../../domain/entities/teams.entity';

@Injectable()
export class FindByIdTeamtUseCase {
  constructor(
    @Inject('ITeamRepository')
    private readonly teamRepo: ITeamRepository,
  ) {}

  async execute(id: number): Promise<Team> {
    const team = await this.teamRepo.findById(id);
    if (!team) {
      throw new NotFoundException(`Equipo con id ${id} no encontrado`);
    }
    return team;
  }
}

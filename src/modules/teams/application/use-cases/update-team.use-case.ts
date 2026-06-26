import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { ITeamRepository } from '../../domain/interfaces/team-repository.interface';
import { TeamDto } from '../dto/team.dto';
import { Team } from '../../domain/entities/teams.entity';

@Injectable()
export class UpdateTeamUseCase {
  constructor(
    @Inject('ITeamRepository')
    private readonly teamRepo: ITeamRepository,
  ) {}

  async execute(id: number, dto: TeamDto): Promise<Team> {
    const editTournament = Team.create(dto.name);
    const team = await this.teamRepo.update(id, editTournament);
    if (!team) {
      throw new NotFoundException(`Equipo con id ${id} no encontrado`);
    }
    return team;
  }
}

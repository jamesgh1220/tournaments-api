import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { TeamDto } from '../dto/team.dto';
import { Team } from '../../domain/entities/teams.entity';
import type { ITeamRepository } from '../../domain/interfaces/team-repository.interface';

@Injectable()
export class CreateTeamUseCase {
  constructor(
    @Inject('ITeamRepository')
    private readonly teamRepo: ITeamRepository,
  ) {}

  async execute(dto: TeamDto): Promise<Team> {
    const exists = await this.teamRepo.findByName(dto.name);
    if (exists) {
      throw new ConflictException('Ya existe un equipo con ese nombre.');
    }

    const team = Team.create(dto.name);
    const savedTeam = await this.teamRepo.create(team);
    return savedTeam;
  }
}

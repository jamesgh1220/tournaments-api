import { Injectable } from '@nestjs/common';
import { Team } from '../../domain/entities/teams.entity';
import { TeamDto } from '../dto/team.dto';
import { CreateTeamUseCase } from '../use-cases/create-team.use-case';
import { FindTeamsUseCase } from '../use-cases/find-teams.use-case';
import { FindByIdTeamtUseCase } from '../use-cases/find-by-id-team.use-case';
import { UpdateTeamUseCase } from '../use-cases/update-team.use-case';
import { DeleteTeamUseCase } from '../use-cases/delete-team.use-case';

@Injectable()
export class TeamsService {
  constructor(
    private readonly createTeamUseCase: CreateTeamUseCase,
    private readonly findTeamsUseCase: FindTeamsUseCase,
    private readonly findByIdTeamtUseCase: FindByIdTeamtUseCase,
    private readonly updateTeamUseCase: UpdateTeamUseCase,
    private readonly deleteTeamUseCase: DeleteTeamUseCase,
  ) {}

  async find(): Promise<Team[] | []> {
    return await this.findTeamsUseCase.execute();
  }

  async findById(id: number): Promise<Team | null> {
    return await this.findByIdTeamtUseCase.execute(id);
  }

  async create(dto: TeamDto): Promise<Team | null> {
    return await this.createTeamUseCase.execute(dto);
  }

  async update(id: number, dto: TeamDto): Promise<Team | null> {
    return await this.updateTeamUseCase.execute(id, dto);
  }

  async remove(id: number): Promise<void> {
    await this.deleteTeamUseCase.execute(id);
  }
}

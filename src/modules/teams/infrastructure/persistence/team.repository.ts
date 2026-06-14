import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from '../../domain/entities/teams.entity';
import { TeamOrmEntity } from './team.orm-entity';
import type { ITeamRepository } from '../../domain/interfaces/team-repository.interface';

@Injectable()
export class TeamRepository implements ITeamRepository {
  constructor(
    @InjectRepository(TeamOrmEntity)
    private readonly teamRepo: Repository<TeamOrmEntity>,
  ) {}

  async find(): Promise<Team[]> {
    return await this.teamRepo.find();
  }

  async create(team: Team): Promise<Team> {
    return await this.teamRepo.save(team);
  }

  async findById(id: number): Promise<Team | null> {
    return await this.teamRepo.findOne({ where: { id } });
  }

  async findByName(name: string): Promise<Team | null> {
    return await this.teamRepo.findOne({ where: { name } });
  }

  async update(id: number, data: Partial<Team>): Promise<Team | null> {
    await this.teamRepo.update(id, data);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    const orm = await this.teamRepo.findOne({ where: { id } });

    if (!orm) {
      throw new Error(`El equipo con id ${id} no existe`);
    }

    await this.teamRepo.remove(orm);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from '../../domain/entities/teams.entity';
import type { ITeamRepository } from '../../domain/interfaces/team-repository.interface';

@Injectable()
export class TeamRepository implements ITeamRepository {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepo: Repository<Team>,
  ) {}
  async find(): Promise<Team[] | []> {
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
    return await this.findById(id);
  }
  async delete(id: number): Promise<void> {
    const team = await this.findById(id);

    if (!team) {
      throw new Error(`El equipo con id ${id} no existe`);
    }

    await this.teamRepo.remove(team);
  }
}

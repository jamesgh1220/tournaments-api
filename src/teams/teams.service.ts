import { Injectable } from '@nestjs/common';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Team } from './entities/teams.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private repo: Repository<Team>,
  ) {}

  async create(data: CreateTeamDto): Promise<Team> {
    const teamExists = await this.repo.findOne({
      where: {
        name: data.name,
      },
    });

    if (teamExists) {
      throw new BadRequestException('A team with that name already exists');
    }

    const team = this.repo.create(data);
    return this.repo.save(team);
  }
}

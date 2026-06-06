import { Injectable, NotFoundException } from '@nestjs/common';
import { Match } from './entities/match.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMatchDto } from './dto/create-match.dto';
import { Group } from 'src/groups/entities/group.entity';
import { Phase } from 'src/phase/entities/phase.entity';
import { Team } from 'src/teams/entities/teams.entity';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match)
    private repo: Repository<Match>,
  ) {}

  findAll(): Promise<Match[]> {
    return this.repo.find();
  }

  async findOne(id: number): Promise<Match> {
    const match = await this.repo.findOneBy({ id });
    if (!match) throw new NotFoundException(`Partido #${id} no encontrado`);
    return match;
  }

  create(data: CreateMatchDto): Promise<Match> {
    const match = this.repo.create({
      phase: { id: data.phaseId },
      homeTeam: { id: data.homeTeamId },
      awayTeam: { id: data.awayTeamId },
      homeScore: data.homeScore ?? 0,
      awayScore: data.awayScore ?? 0,
      status: data.status ?? 'TO_COME',
      scheduledAt: new Date(data.scheduledAt),
    });

    if (data.groupId) {
      match.group = { id: data.groupId } as Group;
    }

    return this.repo.save(match);
  }

  async update(id: number, data: CreateMatchDto): Promise<Match> {
    const match = await this.findOne(id);

    match.phase = { id: data.phaseId } as Phase;
    match.group = { id: data.groupId } as Group;
    match.homeTeam = { id: data.homeTeamId } as Team;
    match.awayTeam = { id: data.awayTeamId } as Team;
    match.homeScore = data.homeScore ?? 0;
    match.awayScore = data.awayScore ?? 0;
    match.status = data.status ?? 'TO_COME';
    match.scheduledAt = new Date(data.scheduledAt);

    return this.repo.save(match);
  }

  async remove(id: number): Promise<void> {
    const match = await this.findOne(id);
    await this.repo.remove(match);
  }
}

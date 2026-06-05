import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tournament } from './entities/tournament.entity';

@Injectable()
export class TournamentsService {
  constructor(
    @InjectRepository(Tournament)
    private repo: Repository<Tournament>,
  ) {}

  findAll(): Promise<Tournament[]> {
    return this.repo.find();
  }

  async findOne(id: number): Promise<Tournament> {
    const tournament = await this.repo.findOneBy({ id });
    if (!tournament) throw new NotFoundException(`Torneo #${id} no encontrado`);
    return tournament;
  }

  create(data: Partial<Tournament>): Promise<Tournament> {
    const tournament = this.repo.create(data);
    return this.repo.save(tournament);
  }

  async update(id: number, data: Partial<Tournament>): Promise<Tournament> {
    await this.repo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const tournament = await this.findOne(id);
    await this.repo.remove(tournament);
  }
}

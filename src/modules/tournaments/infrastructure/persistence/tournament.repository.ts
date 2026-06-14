import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tournament } from '../../domain/entities/tournament.entity';
import type { ITournamentRepository } from '../../domain/interfaces/tournament-repository.interface';

@Injectable()
export class TournamentRepository implements ITournamentRepository {
  constructor(
    @InjectRepository(Tournament)
    private readonly tournamentRepo: Repository<Tournament>,
  ) {}

  async find(): Promise<Tournament[] | []> {
    return await this.tournamentRepo.find();
  }

  async create(tournament: Tournament): Promise<Tournament> {
    return await this.tournamentRepo.save(tournament);
  }

  async findById(id: number): Promise<Tournament | null> {
    return await this.tournamentRepo.findOne({ where: { id } });
  }

  async findByName(name: string): Promise<Tournament | null> {
    return await this.tournamentRepo.findOne({ where: { name } });
  }

  async update(
    id: number,
    data: Partial<Tournament>,
  ): Promise<Tournament | null> {
    await this.tournamentRepo.update(id, data);
    return await this.findById(id);
  }

  async delete(id: number): Promise<void> {
    const tournament = await this.findById(id);

    if (!tournament) {
      throw new Error(`El torneo con id ${id} no existe`);
    }

    await this.tournamentRepo.remove(tournament);
  }
}

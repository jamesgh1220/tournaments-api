import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Phase } from './entities/phase.entity';
import { CreatePhaseDto } from './dto/phase.dto';

@Injectable()
export class PhaseService {
  constructor(
    @InjectRepository(Phase)
    private phaseRepo: Repository<Phase>,
  ) {}

  findAll(): Promise<Phase[]> {
    return this.phaseRepo.find();
  }

  async findOne(id: number): Promise<Phase> {
    const phase = await this.phaseRepo.findOneBy({ id });
    if (!phase) throw new NotFoundException(`Fase #${id} no encontrado`);
    return phase;
  }

  async create(data: CreatePhaseDto): Promise<Phase> {
    const phase = this.phaseRepo.create({
      ...data,
      tournament: { id: data.tournamentId },
      type: { id: data.typeId },
    });

    return this.phaseRepo.save(phase);
  }

  async update(id: number, data: Partial<CreatePhaseDto>): Promise<Phase> {
    await this.phaseRepo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const phase = await this.findOne(id);
    await this.phaseRepo.remove(phase);
  }
}

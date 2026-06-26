import { PhaseTypeOrmEntity } from './phase-type.orm-entity';
import { TournamentOrmEntity } from 'src/modules/tournaments/infrastructure/persistence/tournament.orm-entity';
import type { IPhaseRepository } from '../../domain/interfaces/phase-repository.interface';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Phase } from '../../domain/entities/phase.entity';
import { PhaseOrmEntity } from './phase.orm-entity';
import { PhaseMapper } from './phase.mapper';

@Injectable()
export class PhaseRepository implements IPhaseRepository {
  constructor(
    @InjectRepository(PhaseOrmEntity)
    private readonly phaseRepo: Repository<PhaseOrmEntity>,
  ) {}

  async find(): Promise<Phase[]> {
    const ormEntities = await this.phaseRepo.find();
    return ormEntities.map(PhaseMapper.toDomain);
  }

  async create(phase: Phase): Promise<Phase> {
    const ormEntity = this.phaseRepo.create({
      name: phase.name,
      status: phase.status,
      order_number: phase.order_number,
      tournament: { id: phase.tournamentId } as TournamentOrmEntity,
      type: { id: phase.typeId } as PhaseTypeOrmEntity,
    });
    if (phase.tournamentId != null) {
      ormEntity.tournamentId = phase.tournamentId;
    }
    if (phase.typeId != null) {
      ormEntity.typeId = phase.typeId;
    }
    const saved = await this.phaseRepo.save(ormEntity);
    return PhaseMapper.toDomain(saved);
  }

  async findById(id: number): Promise<Phase | null> {
    const ormEntity = await this.phaseRepo.findOneBy({ id });
    return ormEntity ? PhaseMapper.toDomain(ormEntity) : null;
  }

  async findByTournamentId(tournamentId: number): Promise<Phase[]> {
    const ormEntities = await this.phaseRepo.find({
      where: {
        tournamentId,
      },
    });

    return ormEntities ? ormEntities.map(PhaseMapper.toDomain) : [];
  }

  async findActiveByTournamentId(tournamentId: number): Promise<Phase | null> {
    const ormEntity = await this.phaseRepo.findOne({
      where: {
        tournamentId,
        status: 'IN_PROGRESS',
      },
      relations: {
        type: true,
      },
    });

    return ormEntity ? PhaseMapper.toDomain(ormEntity) : null;
  }

  async update(id: number, data: Partial<Phase>): Promise<Phase | null> {
    const orm = await this.phaseRepo.findOneBy({ id });
    if (!orm) return null;

    if (data.name !== undefined) orm.name = data.name;
    if (data.status !== undefined) orm.status = data.status;
    if (data.order_number !== undefined) orm.order_number = data.order_number;
    if (data.tournamentId !== undefined) {
      orm.tournamentId = data.tournamentId;
      orm.tournament = { id: data.tournamentId } as TournamentOrmEntity;
    }
    if (data.typeId !== undefined) {
      orm.typeId = data.typeId;
      orm.type = { id: data.typeId } as PhaseTypeOrmEntity;
    }

    const saved = await this.phaseRepo.save(orm);
    return PhaseMapper.toDomain(saved);
  }

  async delete(id: number): Promise<void> {
    const result = await this.phaseRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Phase with id ${id} not found`);
    }
  }
}

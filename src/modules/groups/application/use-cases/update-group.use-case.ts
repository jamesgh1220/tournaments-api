import { Inject, Injectable } from '@nestjs/common';
import { GroupDto } from '../dto/group.dto';
import { Group } from '../../domain/entities/group.entity';
import type { IGroupRepository } from '../../domain/interfaces/group-repository.interface';

@Injectable()
export class UpdateGroupUseCase {
  constructor(
    @Inject('IGroupRepository')
    private readonly groupRepo: IGroupRepository,
  ) {}

  async execute(id: number, dto: GroupDto): Promise<Group | null> {
    return await this.groupRepo.update(id, {
      name: dto.name,
      phaseId: dto.phaseId,
    });
  }
}

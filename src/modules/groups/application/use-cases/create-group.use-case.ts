import { Inject, Injectable } from '@nestjs/common';
import { GroupDto } from '../dto/group.dto';
import { Group } from '../../domain/entities/group.entity';
import type { IGroupRepository } from '../../domain/interfaces/group-repository.interface';

@Injectable()
export class CreateGroupUseCase {
  constructor(
    @Inject('IGroupRepository')
    private readonly groupRepo: IGroupRepository,
  ) {}

  async execute(dto: GroupDto): Promise<Group> {
    const group = Group.create(dto.name, dto.phaseId);
    const savedGroup = await this.groupRepo.create(group);
    return savedGroup;
  }
}

import { Inject, Injectable } from '@nestjs/common';
import type { IGroupRepository } from '../../domain/interfaces/group-repository.interface';
import { Group } from '../../domain/entities/group.entity';

@Injectable()
export class FindGroupsUseCase {
  constructor(
    @Inject('IGroupRepository')
    private readonly groupRepo: IGroupRepository,
  ) {}

  async execute(): Promise<Group[]> {
    const groups = await this.groupRepo.find();
    return groups;
  }
}

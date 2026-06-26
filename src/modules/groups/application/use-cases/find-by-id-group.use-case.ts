import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IGroupRepository } from '../../domain/interfaces/group-repository.interface';
import { Group } from '../../domain/entities/group.entity';

@Injectable()
export class FindByIdGroupUseCase {
  constructor(
    @Inject('IGroupRepository')
    private readonly groupRepo: IGroupRepository,
  ) {}

  async execute(id: number): Promise<Group> {
    const group = await this.groupRepo.findById(id);
    if (!group) {
      throw new NotFoundException(`Grupo con id ${id} no encontrado`);
    }
    return group;
  }
}

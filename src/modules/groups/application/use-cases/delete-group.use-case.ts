import { Inject, Injectable } from '@nestjs/common';
import type { IGroupRepository } from '../../domain/interfaces/group-repository.interface';

@Injectable()
export class DeleteGroupUseCase {
  constructor(
    @Inject('IGroupRepository')
    private readonly groupRepo: IGroupRepository,
  ) {}

  async execute(id: number): Promise<void> {
    return await this.groupRepo.delete(id);
  }
}

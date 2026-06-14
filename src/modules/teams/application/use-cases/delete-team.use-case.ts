import { Inject, Injectable } from '@nestjs/common';
import type { ITeamRepository } from '../../domain/interfaces/team-repository.interface';

@Injectable()
export class DeleteTeamUseCase {
  constructor(
    @Inject('ITeamRepository')
    private readonly teamRepo: ITeamRepository,
  ) {}

  async execute(id: number): Promise<void> {
    return await this.teamRepo.delete(id);
  }
}

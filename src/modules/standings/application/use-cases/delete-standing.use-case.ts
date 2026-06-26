import { Inject, Injectable } from '@nestjs/common';
import type { IStandingRepository } from '../../domain/interfaces/standing-repository.interface';

@Injectable()
export class DeleteStandingUseCase {
  constructor(
    @Inject('IStandingRepository')
    private readonly standingRepo: IStandingRepository,
  ) {}

  async execute(id: number): Promise<void> {
    return await this.standingRepo.delete(id);
  }
}

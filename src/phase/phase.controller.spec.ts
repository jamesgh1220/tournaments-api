import { Test, TestingModule } from '@nestjs/testing';
import { PhaseController } from './phase.controller';

describe('PhaseController', () => {
  let controller: PhaseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PhaseController],
    }).compile();

    controller = module.get<PhaseController>(PhaseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

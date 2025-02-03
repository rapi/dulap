import { Test, TestingModule } from '@nestjs/testing';
import { BehanceController } from './behance.controller';

describe('BehanceController', () => {
  let controller: BehanceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BehanceController],
    }).compile();

    controller = module.get<BehanceController>(BehanceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

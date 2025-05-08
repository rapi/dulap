import { Test, TestingModule } from '@nestjs/testing';
import { BehanceService } from './behance.service';

describe('BehanceService', () => {
  let service: BehanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BehanceService],
    }).compile();

    service = module.get<BehanceService>(BehanceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

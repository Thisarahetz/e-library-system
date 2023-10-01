import { Test, TestingModule } from '@nestjs/testing';
import { PabxApiService } from './pabx-api.service';

describe('PabxApiService', () => {
  let service: PabxApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PabxApiService],
    }).compile();

    service = module.get<PabxApiService>(PabxApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

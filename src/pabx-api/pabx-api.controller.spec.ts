import { Test, TestingModule } from '@nestjs/testing';
import { PabxApiController } from './pabx-api.controller';
import { PabxApiService } from './pabx-api.service';

describe('PabxApiController', () => {
  let controller: PabxApiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PabxApiController],
      providers: [PabxApiService],
    }).compile();

    controller = module.get<PabxApiController>(PabxApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

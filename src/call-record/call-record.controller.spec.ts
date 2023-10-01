import { Test, TestingModule } from '@nestjs/testing';
import { CallRecordController } from './call-record.controller';
import { CallRecordService } from './call-record.service';

describe('CallRecordController', () => {
  let controller: CallRecordController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CallRecordController],
      providers: [CallRecordService],
    }).compile();

    controller = module.get<CallRecordController>(CallRecordController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

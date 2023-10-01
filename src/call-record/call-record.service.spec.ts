import { Test, TestingModule } from '@nestjs/testing';
import { CallRecordService } from './call-record.service';

describe('CallRecordService', () => {
  let service: CallRecordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CallRecordService],
    }).compile();

    service = module.get<CallRecordService>(CallRecordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

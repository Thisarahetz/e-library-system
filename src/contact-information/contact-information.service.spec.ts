import { Test, TestingModule } from '@nestjs/testing';
import { ContactInformationService } from './contact-information.service';

describe('ContactInformationService', () => {
  let service: ContactInformationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContactInformationService],
    }).compile();

    service = module.get<ContactInformationService>(ContactInformationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

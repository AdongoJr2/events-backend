import { Test, TestingModule } from '@nestjs/testing';
import { ApiListResponseService } from './api-list-response.service';

describe('ApiListResponseService', () => {
  let service: ApiListResponseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApiListResponseService],
    }).compile();

    service = module.get<ApiListResponseService>(ApiListResponseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

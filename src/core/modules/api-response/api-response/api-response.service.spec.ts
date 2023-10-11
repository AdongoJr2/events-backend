import { Test, TestingModule } from '@nestjs/testing';
import { ApiResponseService } from './api-response.service';

describe('ApiResponseService', () => {
  let service: ApiResponseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApiResponseService],
    }).compile();

    service = module.get<ApiResponseService>(ApiResponseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getResponseBody()', () => {
    it('should return the response body passed', () => {
      const user = { id: 1, name: 'John' };

      const sampleResBody = service.getResponseBody({
        status: 'success',
        message: 'user retrieved successfully',
        data: user,
      });

      expect(sampleResBody).toEqual({
        status: 'success',
        message: 'user retrieved successfully',
        data: user,
      });
    });
  });
});

import { Module } from '@nestjs/common';
import { ApiListResponseService } from './api-list-response/api-list-response.service';
import { ApiResponseService } from './api-response/api-response.service';

@Module({
  imports: [],
  providers: [ApiListResponseService, ApiResponseService],
  exports: [ApiListResponseService, ApiResponseService],
})
export class ApiResponseModule {}

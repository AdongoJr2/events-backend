import { Injectable } from '@nestjs/common';
import {
  APIListResponseBody,
  APIListResponseBodyOptions,
} from 'src/core/types/api-list-response-body';
import { generateListResponseBodyData } from 'src/utils/response/response-body';

@Injectable()
export class ApiListResponseService {
  public getResponseBody<T>({
    message,
    count,
    pageSize,
    records,
  }: APIListResponseBodyOptions<T>) {
    const resBody: APIListResponseBody<T> = {
      status: 'success',
      message: message || 'records retrieved successfully',
      data: generateListResponseBodyData(count, pageSize, records),
    };

    return resBody;
  }
}

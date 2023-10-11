import { Injectable } from '@nestjs/common';
import { APIResponseBody } from 'src/core/types/api-response-body';

@Injectable()
export class ApiResponseService {
  public getResponseBody({
    status,
    message,
    data,
  }: APIResponseBody): APIResponseBody {
    const resBody = {
      status,
      message,
      data,
    };

    return resBody;
  }
}

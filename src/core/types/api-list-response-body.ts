import { APIResponseBody } from './api-response-body';

export interface APIListResponseBody<T> extends APIResponseBody {
  status: 'success';
  data: APIListResponseBodyData<T>;
}

export interface APIListResponseBodyData<T> {
  count: number;
  pages: number;
  list: T[];
}

export interface APIListResponseBodyOptions<T> {
  message?: string;
  count: number;
  pageSize: number;
  records: T[];
}

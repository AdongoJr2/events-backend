export interface APIResponseBody {
  status: 'success' | 'error';
  message: string;
  data: any;
}

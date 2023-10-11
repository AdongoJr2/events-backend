import { APIListResponseBodyData } from 'src/core/types/api-list-response-body';
import { calculatePageSize } from '../pagination/pagination';

export const generateListResponseBodyData = <T>(
  count: number,
  pageSize: number,
  records: T[],
): APIListResponseBodyData<T> => {
  const calculatedPageSizeValue = calculatePageSize(pageSize);
  const totalPages = Math.ceil(count / calculatedPageSizeValue);

  const data: APIListResponseBodyData<T> = {
    count,
    pages: totalPages,
    list: records,
  };

  return data;
};

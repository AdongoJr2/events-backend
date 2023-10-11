interface PaginationInput {
  page?: number;
  pageSize?: number;
}

export const defaultPageValues = {
  page: 1,
  pageSize: 10,
};

export const calculatePageNumber = (page?: number) => {
  return page ? Math.abs(page) : defaultPageValues.page;
};
export const calculatePageSize = (pageSize?: number) => {
  return pageSize ? Math.abs(pageSize) : defaultPageValues.pageSize;
};

export const calculateDBOffsetAndLimit = ({
  page,
  pageSize,
}: PaginationInput) => {
  const calculatedPageValue = calculatePageNumber(page);
  const calculatedPageSizeValue = calculatePageSize(pageSize);

  const offset = (calculatedPageValue - 1) * calculatedPageSizeValue;
  const limit = calculatedPageSizeValue;

  return {
    offset,
    limit,
  };
};

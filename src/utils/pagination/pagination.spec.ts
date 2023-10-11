import {
  calculateDBOffsetAndLimit,
  calculatePageNumber,
  calculatePageSize,
  defaultPageValues,
} from './pagination';

describe('calculatePageNumber()', () => {
  it('should return the absolute value when a negative number argument is passed', () => {
    expect(calculatePageNumber(-1)).toBe(1);
    expect(calculatePageNumber(-5)).toBe(5);
  });

  it('should return the absolute value when a positive number argument is passed', () => {
    expect(calculatePageNumber(15)).toBe(15);
  });

  it('should return default page value when no argument is passed', () => {
    expect(calculatePageNumber()).toBe(defaultPageValues.page);
  });
});

describe('calculatePageSize()', () => {
  it('should return the absolute value when a negative number argument is passed', () => {
    expect(calculatePageSize(-1)).toBe(1);
    expect(calculatePageSize(-5)).toBe(5);
  });

  it('should return the absolute value when a positive number argument is passed', () => {
    expect(calculatePageSize(15)).toBe(15);
  });

  it('should return default page size value when no argument is passed', () => {
    expect(calculatePageSize()).toBe(defaultPageValues.pageSize);
  });
});

describe('calculateDBOffsetAndLimit()', () => {
  it('should return correct database offset and limit values', () => {
    const result = calculateDBOffsetAndLimit({ page: 10, pageSize: 5 });

    expect(result).toEqual({
      offset: 45,
      limit: 5,
    });
  });

  it('should return database offset as 0 (zero) when the page value provided is 1', () => {
    const result = calculateDBOffsetAndLimit({ page: 1, pageSize: 5 });

    expect(result).toEqual({
      offset: 0,
      limit: 5,
    });
  });
});

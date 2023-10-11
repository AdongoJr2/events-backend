import { Injectable, Logger } from '@nestjs/common';
import { Brackets, ObjectLiteral, SelectQueryBuilder } from 'typeorm';

@Injectable()
export class FilterService {
  constructor(private logger: Logger) {}

  async addFiltersQuery<T extends ObjectLiteral>(
    queryBuilder: SelectQueryBuilder<T>,
    filterQuery?: string,
    isSearch = false,
  ) {
    // TODO: how to limit fields that can be filtered

    const searchOrFilter = isSearch ? 'SEARCH' : 'FILTER';
    const alias = queryBuilder.alias;

    this.logger.log(filterQuery, `${searchOrFilter} QUERY`);

    if (!filterQuery) return;

    const filterQueryItems = filterQuery.split('|');
    this.logger.log(filterQueryItems, `${searchOrFilter} QUERY QUERY ITEMS`);

    /* Equality Filters */
    const filterOptionTuples: [string, ObjectLiteral][] = [];

    for (const filterQueryItem of filterQueryItems) {
      const keyValue = filterQueryItem.split('::');

      // equality operator not found
      if (keyValue.length === 1) continue;

      const key = keyValue[0];
      const value = <any>keyValue[1];

      filterOptionTuples.push([`${alias}.${key}`, value]);
    }

    this.logger.log(filterOptionTuples, `${searchOrFilter} OPTION TUPLES`);

    const bracketsOptions: { [key: string]: ObjectLiteral } = {};

    filterOptionTuples.forEach((filterOptionTuple, index) => {
      let key = filterOptionTuple[0];

      // accounting for nested filters
      const dotSegments = key.split('.');
      if (dotSegments.length > 2) {
        const sortKeyArr = dotSegments.slice(dotSegments.length - 2); // pick the last 2 items
        key = sortKeyArr.join('.');
      }

      this.logger.log(key, `${searchOrFilter} KEY`);

      if (isSearch) {
        /* search */
        const keyUniqueId = `${key}_unique`;
        const formattedKey = `${key} ILIKE :${keyUniqueId}`;

        this.logger.log(keyUniqueId, 'SEARCH KEY UNIQUE ID');
        this.logger.log(formattedKey, 'SEARCH KEY FORMATTED');

        bracketsOptions[formattedKey] = {
          [keyUniqueId]: `%${filterOptionTuple[1]}%`,
        };
      } else {
        /* filters */
        const keyUniqueId = `${key}_unique_${index}`;
        const formattedKey = `${key} = :${keyUniqueId}`;

        this.logger.log(keyUniqueId, 'FILTER KEY UNIQUE ID');
        this.logger.log(formattedKey, 'FILTER KEY FORMATTED');

        bracketsOptions[formattedKey] = {
          [keyUniqueId]: filterOptionTuple[1],
        };
      }
    });

    this.logger.log(bracketsOptions, 'BRACKET OPTIONS');

    /* Range Filters */
    const rangeFilterOptionTuples: [
      string,
      {
        operator: string;
        value: ObjectLiteral;
      },
    ][] = [];

    for (const filterQueryItem of filterQueryItems) {
      let key = '';
      let value: any = '';
      let comparisonOperator = '>';

      const gtRangeFilterItems = filterQueryItem.split('>');

      // '>' separator not present
      if (gtRangeFilterItems.length === 1) {
        const ltRangeFilterItems = filterQueryItem.split('<');

        // '<' separator not present
        if (ltRangeFilterItems.length === 1) continue;

        key = ltRangeFilterItems[0];
        value = ltRangeFilterItems[1];
        comparisonOperator = '<';
      } else {
        key = gtRangeFilterItems[0];
        value = gtRangeFilterItems[1];
        comparisonOperator = '>';
      }

      rangeFilterOptionTuples.push([
        `${alias}.${key}`,
        { operator: comparisonOperator, value },
      ]);
    }

    this.logger.log(rangeFilterOptionTuples, 'RANGE FILTER OPTION TUPLES');

    const rangeBracketsOptions: { [key: string]: ObjectLiteral } = {};

    rangeFilterOptionTuples.forEach((rangeFilterOptionTuple, index) => {
      let key = rangeFilterOptionTuple[0];

      // accounting for nested filters
      const dotSegments = key.split('.');
      if (dotSegments.length > 2) {
        const sortKeyArr = dotSegments.slice(dotSegments.length - 2); // pick the last 2 items
        key = sortKeyArr.join('.');
      }

      this.logger.log(key, 'RANGE FILTER KEY');

      const keyUniqueId = `${key}_unique_${index}`;
      const formattedKey = `${key} ${rangeFilterOptionTuple[1].operator} :${keyUniqueId}`;

      this.logger.log(keyUniqueId, 'FILTER KEY UNIQUE ID');
      this.logger.log(formattedKey, 'FILTER KEY FORMATTED');

      rangeBracketsOptions[formattedKey] = {
        [keyUniqueId]: rangeFilterOptionTuple[1].value,
      };
    });

    this.logger.log(rangeBracketsOptions, 'BRACKET OPTIONS RANGE');

    if (isSearch) {
      /* search */
      queryBuilder.orWhere(
        new Brackets((qb) => {
          for (const key in bracketsOptions) {
            if (Object.prototype.hasOwnProperty.call(bracketsOptions, key)) {
              qb.orWhere(key, bracketsOptions[key]);
            }
          }
        }),
      );
    } else {
      /* equality filters */
      queryBuilder.andWhere(
        new Brackets((qb) => {
          for (const key in bracketsOptions) {
            if (Object.prototype.hasOwnProperty.call(bracketsOptions, key)) {
              qb.andWhere(key, bracketsOptions[key]);
            }
          }
        }),
      );

      /* range filters */
      queryBuilder.andWhere(
        new Brackets((qb) => {
          for (const key in rangeBracketsOptions) {
            if (
              Object.prototype.hasOwnProperty.call(rangeBracketsOptions, key)
            ) {
              qb.andWhere(key, rangeBracketsOptions[key]);
            }
          }
        }),
      );
    }
  }
}

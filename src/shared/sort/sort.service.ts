import { Injectable, Logger } from '@nestjs/common';
import { DBSort } from 'src/core/types/db-sort';
import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';

@Injectable()
export class SortService {
  constructor(private logger: Logger) {}

  async addSortQuery<T extends ObjectLiteral>(
    queryBuilder: SelectQueryBuilder<T>,
    sortQuery?: string,
    defaultSort?: DBSort,
  ) {
    // TODO: how to limit fields that can be sorted

    const alias = queryBuilder.alias;

    this.logger.log(sortQuery, 'SORT QUERY');

    if (!sortQuery) {
      queryBuilder.addOrderBy(
        defaultSort?.sort ?? `${alias}.id`,
        defaultSort?.order ?? 'DESC',
      );

      return;
    }

    const sortClause: { [key: string]: 'ASC' | 'DESC' } = {};

    const sortQueryItems = sortQuery.split('|');
    this.logger.log(sortQueryItems, 'SORT QUERY ITEMS');

    for (const sortQueryItem of sortQueryItems) {
      const keyValue = sortQueryItem.split('::');
      const key = keyValue[0];
      const value: any = keyValue[1].toUpperCase(); // TODO: validate 'value' to ensure only 'asc' or 'desc' string is provided

      sortClause[`${alias}.${key}`] = value;
    }

    const sortClauseTuples = Object.entries(sortClause);

    this.logger.log(sortClauseTuples, 'SORT CLAUSE TUPLES');

    for (const sortClauseTuple of sortClauseTuples) {
      let key = sortClauseTuple[0];

      // accounting for nested sorting
      const dotSegments = key.split('.');
      if (dotSegments.length > 2) {
        const sortKeyArr = dotSegments.slice(dotSegments.length - 2); // pick the last 2 items
        key = sortKeyArr.join('.');
      }

      this.logger.log(key, 'SORT KEY');

      queryBuilder.addOrderBy(key, sortClauseTuple[1]);
    }
  }
}

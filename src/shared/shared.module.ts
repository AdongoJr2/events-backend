import { Module } from '@nestjs/common';
import { FilterModule } from './filter/filter.module';
import { SortModule } from './sort/sort.module';

@Module({
  imports: [FilterModule, SortModule],
  providers: [],
  exports: [FilterModule, SortModule],
})
export class SharedModule {}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateEventCategoryDto } from './dto/create-event-category.dto';
import { UpdateEventCategoryDto } from './dto/update-event-category.dto';
import { EventCategory } from './entities/event-category.entity';
import { Repository } from 'typeorm';
import { FilterService } from 'src/shared/filter/filter.service';
import { SortService } from 'src/shared/sort/sort.service';
import { calculateDBOffsetAndLimit } from 'src/utils/pagination/pagination';
import { NotFoundException } from 'src/utils/exceptions/not-found.exception';

@Injectable()
export class EventCategoryService {
  constructor(
    @InjectRepository(EventCategory)
    private eventCategoryRepository: Repository<EventCategory>,
    private filterService: FilterService,
    private sortService: SortService,
  ) {}

  async create(createEventCategoryDto: CreateEventCategoryDto) {
    try {
      const newRecord = this.eventCategoryRepository.create(
        createEventCategoryDto,
      );
      const savedRecord = await this.eventCategoryRepository.save(newRecord);
      return new EventCategory({ ...savedRecord });
    } catch (error) {
      throw error;
    }
  }

  async findAll(
    page?: number,
    pageSize?: number,
    filterQuery?: string,
    searchQuery?: string,
    sortQuery?: string,
  ) {
    try {
      const { offset, limit } = calculateDBOffsetAndLimit({ page, pageSize });

      const eventCategoryAlias = 'eventCategory';

      const queryBuilder =
        this.eventCategoryRepository.createQueryBuilder(eventCategoryAlias);

      /* SEARCH */
      await this.filterService.addFiltersQuery(queryBuilder, searchQuery, true);

      /* FILTER */
      await this.filterService.addFiltersQuery(queryBuilder, filterQuery);

      /* SORT */
      await this.sortService.addSortQuery(queryBuilder, sortQuery);

      return queryBuilder.skip(offset).take(limit).getManyAndCount();
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const foundItem = await this.eventCategoryRepository.findOne({
        where: { id },
      });

      if (!foundItem) {
        throw new NotFoundException(
          `Event category with id: ${id} does not exist`,
        );
      }

      return foundItem;
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, updateEventCategoryDto: UpdateEventCategoryDto) {
    try {
      const foundRecord = await this.findOne(id);

      const recordToUpdate = this.eventCategoryRepository.create({
        ...foundRecord,
        ...updateEventCategoryDto,
      });

      const updatedRecord =
        await this.eventCategoryRepository.save(recordToUpdate);
      return updatedRecord;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    try {
      await this.findOne(id);

      const result = await this.eventCategoryRepository.delete(id);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

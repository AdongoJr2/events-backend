import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { DataSource, Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterService } from 'src/shared/filter/filter.service';
import { SortService } from 'src/shared/sort/sort.service';
import { EventCategory } from '../event-category/entities/event-category.entity';
import { calculateDBOffsetAndLimit } from 'src/utils/pagination/pagination';
import { DBSort } from 'src/core/types/db-sort';
import { NotFoundException } from 'src/utils/exceptions/not-found.exception';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    private dataSource: DataSource,
    private filterService: FilterService,
    private sortService: SortService,
  ) {}

  async create(createEventDto: CreateEventDto, eventCategory: EventCategory) {
    try {
      const newRecord = this.eventRepository.create({
        ...createEventDto,
        eventCategory,
      });
      const savedRecord = await this.eventRepository.save(newRecord);
      return new Event({ ...savedRecord });
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

      const eventAlias = 'event';
      const eventCategoryRelationName = 'eventCategory';

      const queryBuilder = this.eventRepository.createQueryBuilder(eventAlias);

      /* SEARCH */
      await this.filterService.addFiltersQuery(queryBuilder, searchQuery, true);

      /* FILTER */
      await this.filterService.addFiltersQuery(queryBuilder, filterQuery);

      /* SORT */
      const defaultSort: DBSort = {
        sort: `${eventAlias}.eventDate`,
        order: 'DESC',
      };
      await this.sortService.addSortQuery(queryBuilder, sortQuery, defaultSort);

      return queryBuilder
        .leftJoinAndSelect(
          `${eventAlias}.${eventCategoryRelationName}`,
          eventCategoryRelationName,
        )
        .select([eventAlias])
        .addSelect([
          `${eventCategoryRelationName}.id`,
          `${eventCategoryRelationName}.name`,
        ])
        .skip(offset)
        .take(limit)
        .getManyAndCount();
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const foundItem = await this.eventRepository.findOne({
        where: { id },
        relations: {
          eventCategory: true,
        },
        select: {
          eventCategory: {
            id: true,
            name: true,
          },
        },
      });

      if (!foundItem) {
        throw new NotFoundException(`Event with id: ${id} does not exist`);
      }

      return foundItem;
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: number,
    updateEventCategoryDto: UpdateEventDto,
    eventCategory: EventCategory,
  ) {
    try {
      const foundRecord = await this.findOne(id);

      const recordToUpdate = this.eventRepository.create({
        ...foundRecord,
        ...updateEventCategoryDto,
        eventCategory,
      });

      const updatedRecord = await this.eventRepository.save(recordToUpdate);
      return updatedRecord;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    try {
      await this.findOne(id);

      const result = await this.eventRepository.delete(id);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

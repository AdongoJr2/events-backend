import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterService } from 'src/shared/filter/filter.service';
import { SortService } from 'src/shared/sort/sort.service';
import { calculateDBOffsetAndLimit } from 'src/utils/pagination/pagination';
import { DeepPartial, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { NotFoundException } from 'src/utils/exceptions/not-found.exception';
import { CreateUserDto } from './dto/create-user.dto';
import { EventCategory } from '../event-category/entities/event-category.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private filterService: FilterService,
    private sortService: SortService,
  ) {}

  async createUser(
    createUserDto: CreateUserDto,
    eventCategories: EventCategory[],
  ): Promise<User> {
    try {
      const newUser = this.usersRepository.create({
        ...createUserDto,
        interests: eventCategories,
      });
      const savedUser = await this.usersRepository.save(newUser);
      return new User({ ...savedUser });
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

      const userAlias = 'user';
      const userInterestsRelationName = 'interests';

      const queryBuilder = this.usersRepository.createQueryBuilder(userAlias);

      /* SEARCH */
      await this.filterService.addFiltersQuery(queryBuilder, searchQuery, true);

      /* FILTER */
      await this.filterService.addFiltersQuery(queryBuilder, filterQuery);

      /* SORT */
      await this.sortService.addSortQuery(queryBuilder, sortQuery);

      return queryBuilder
        .leftJoinAndSelect(
          `${userAlias}.${userInterestsRelationName}`,
          userInterestsRelationName,
        )
        .select([userAlias])
        .addSelect([
          `${userInterestsRelationName}.id`,
          `${userInterestsRelationName}.name`,
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
      const foundUser = await this.usersRepository.findOne({
        where: { id },
        relations: {
          interests: true,
        },
      });

      if (!foundUser) {
        throw new NotFoundException(`User with id: ${id} does not exist`);
      }

      return foundUser;
    } catch (error) {
      throw error;
    }
  }

  async findOneByUsername(username: string) {
    try {
      const foundUser = await this.usersRepository.findOne({
        where: { username },
      });
      return foundUser;
    } catch (error) {
      throw error;
    }
  }

  async update(detailsToUpdate: DeepPartial<User>) {
    try {
      const recordToUpdate = this.usersRepository.create(detailsToUpdate);
      const updatedRecord = await this.usersRepository.save(recordToUpdate);

      return updatedRecord;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const result = await this.usersRepository.delete(id);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

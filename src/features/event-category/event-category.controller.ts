import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpCode,
  HttpStatus,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { EventCategoryService } from './event-category.service';
import { CreateEventCategoryDto } from './dto/create-event-category.dto';
import { UpdateEventCategoryDto } from './dto/update-event-category.dto';
import { ApiResponseService } from 'src/core/modules/api-response/api-response/api-response.service';
import { ApiListResponseService } from 'src/core/modules/api-response/api-list-response/api-list-response.service';
import { DtoValidationPipe } from 'src/core/pipes/dto-validation/dto-validation.pipe';
import { formatDatabaseError } from 'src/utils/transformations/database-errors';
import { DatabaseErrorException } from 'src/utils/exceptions/database-error.exception';
import { InternalServerErrorException } from 'src/utils/exceptions/internal-server-error.exception';
import { defaultPageValues } from 'src/utils/pagination/pagination';
import { NotFoundException } from 'src/utils/exceptions/not-found.exception';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/core/guards/roles.guard';
import { UserRole } from 'src/utils/enums';
import { Roles } from 'src/core/decorators/roles.decorator';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(RolesGuard)
@Controller('event-categories')
export class EventCategoryController {
  constructor(
    private readonly eventCategoryService: EventCategoryService,
    private readonly apiResponseService: ApiResponseService,
    private readonly apiListResponseService: ApiListResponseService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  async create(
    @Body(DtoValidationPipe) createEventCategoryDto: CreateEventCategoryDto,
  ) {
    try {
      const createdRecord = await this.eventCategoryService.create(
        createEventCategoryDto,
      );

      const responseBody = this.apiResponseService.getResponseBody({
        status: 'success',
        message: 'Event Category created successfully',
        data: createdRecord,
      });

      return responseBody;
    } catch (error) {
      // errors from the database
      if (error?.driverError) {
        const { message } = formatDatabaseError(error.driverError);
        throw new DatabaseErrorException(message);
      }

      // other errors
      throw new InternalServerErrorException(error);
    }
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(defaultPageValues.page), ParseIntPipe)
    page: number,
    @Query(
      'pageSize',
      new DefaultValuePipe(defaultPageValues.pageSize),
      ParseIntPipe,
    )
    pageSize: number,
    @Query('filter', new DefaultValuePipe(''))
    filter: string,
    @Query('sort', new DefaultValuePipe(''))
    sort: string,
    @Query('search', new DefaultValuePipe(''))
    search: string,
  ) {
    try {
      const [records, count] = await this.eventCategoryService.findAll(
        page,
        pageSize,
        filter,
        search,
        sort,
      );

      const responseBody = this.apiListResponseService.getResponseBody({
        message: 'Event Categories retrieved successfully',
        count,
        pageSize,
        records,
      });

      return responseBody;
    } catch (error) {
      // other errors
      throw new InternalServerErrorException(error);
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const foundRecord = await this.eventCategoryService.findOne(id);

      const responseBody = this.apiResponseService.getResponseBody({
        status: 'success',
        message: 'Event Category retrieved successfully',
        data: foundRecord,
      });

      return responseBody;
    } catch (error) {
      if (error?.name === 'NotFoundException') {
        throw new NotFoundException(error?.message);
      }

      // other errors
      throw new InternalServerErrorException(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(DtoValidationPipe) updateEventCategoryDto: UpdateEventCategoryDto,
  ) {
    try {
      const updateResult = await this.eventCategoryService.update(
        id,
        updateEventCategoryDto,
      );

      const responseBody = this.apiResponseService.getResponseBody({
        status: 'success',
        message: 'Event Category updated successfully',
        data: updateResult,
      });

      return responseBody;
    } catch (error) {
      if (error?.name === 'NotFoundException') {
        throw new NotFoundException(error?.message);
      }

      // other errors
      throw new InternalServerErrorException(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.eventCategoryService.remove(id);

      const responseBody = this.apiResponseService.getResponseBody({
        status: 'success',
        message: 'Event Category deleted successfully',
        data: undefined,
      });

      return responseBody;
    } catch (error) {
      if (error?.name === 'NotFoundException') {
        throw new NotFoundException(error?.message);
      }

      // other errors
      throw new InternalServerErrorException(error);
    }
  }
}

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
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { RolesGuard } from 'src/core/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EventCategoryService } from '../event-category/event-category.service';
import { ApiResponseService } from 'src/core/modules/api-response/api-response/api-response.service';
import { ApiListResponseService } from 'src/core/modules/api-response/api-list-response/api-list-response.service';
import { Roles } from 'src/core/decorators/roles.decorator';
import { UserRole } from 'src/utils/enums';
import { defaultPageValues } from 'src/utils/pagination/pagination';
import { DtoValidationPipe } from 'src/core/pipes/dto-validation/dto-validation.pipe';
import { formatDatabaseError } from 'src/utils/transformations/database-errors';
import { DatabaseErrorException } from 'src/utils/exceptions/database-error.exception';
import { NotFoundException } from 'src/utils/exceptions/not-found.exception';
import { InternalServerErrorException } from 'src/utils/exceptions/internal-server-error.exception';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('events')
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly eventCategoryService: EventCategoryService,
    private readonly apiResponseService: ApiResponseService,
    private readonly apiListResponseService: ApiListResponseService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.ADMIN)
  @Post()
  async create(@Body(DtoValidationPipe) createEventDto: CreateEventDto) {
    try {
      const eventCategory = await this.eventCategoryService.findOne(
        +createEventDto.eventCategoryId,
      );

      const createdEvent = await this.eventsService.create(
        createEventDto,
        eventCategory,
      );

      const responseBody = this.apiResponseService.getResponseBody({
        status: 'success',
        message: 'Event created successfully',
        data: createdEvent,
      });

      return responseBody;
    } catch (error) {
      // errors from the database
      if (error?.driverError) {
        const { message } = formatDatabaseError(error.driverError);
        throw new DatabaseErrorException(message);
      }

      // custom errors
      if (error?.name === 'NotFoundException') {
        throw new NotFoundException(error?.message);
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
      const [records, count] = await this.eventsService.findAll(
        page,
        pageSize,
        filter,
        search,
        sort,
      );

      const responseBody = this.apiListResponseService.getResponseBody({
        message: 'Events retrieved successfully',
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
  async findOne(@Param('id') id: string) {
    try {
      const foundRecord = await this.eventsService.findOne(+id);

      const responseBody = this.apiResponseService.getResponseBody({
        status: 'success',
        message: 'Event retrieved successfully',
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

  @Roles(UserRole.ADMIN)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    try {
      const eventCategory = await this.eventCategoryService.findOne(
        +updateEventDto.eventCategoryId,
      );

      const updatedEvent = await this.eventsService.update(
        +id,
        updateEventDto,
        eventCategory,
      );

      const responseBody = this.apiResponseService.getResponseBody({
        status: 'success',
        message: 'Event updated successfully',
        data: updatedEvent,
      });

      return responseBody;
    } catch (error) {
      // errors from the database
      if (error?.driverError) {
        const { message } = formatDatabaseError(error.driverError);
        throw new DatabaseErrorException(message);
      }

      // custom errors
      if (error?.name === 'NotFoundException') {
        throw new NotFoundException(error?.message);
      }

      // other errors
      throw new InternalServerErrorException(error);
    }
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.eventsService.remove(+id);

      const responseBody = this.apiResponseService.getResponseBody({
        status: 'success',
        message: 'Event deleted successfully',
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

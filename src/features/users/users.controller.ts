import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  ClassSerializerInterceptor,
  UseInterceptors,
  DefaultValuePipe,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { InternalServerErrorException } from 'src/utils/exceptions/internal-server-error.exception';
import { ApiListResponseService } from 'src/core/modules/api-response/api-list-response/api-list-response.service';
import { NotFoundException } from 'src/utils/exceptions/not-found.exception';
import { defaultPageValues } from 'src/utils/pagination/pagination';
import { ApiResponseService } from 'src/core/modules/api-response/api-response/api-response.service';
import { DtoValidationPipe } from 'src/core/pipes/dto-validation/dto-validation.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { DeepPartial } from 'typeorm';
import { User } from './entities/user.entity';
import { RolesGuard } from 'src/core/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from 'src/core/decorators/roles.decorator';
import { UserRole } from 'src/utils/enums';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly apiResponseService: ApiResponseService,
    private readonly apiListResponseService: ApiListResponseService,
    private readonly logger: Logger,
  ) {}

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
      const [users, count] = await this.usersService.findAll(
        page,
        pageSize,
        filter,
        search,
        sort,
      );

      const responseBody = this.apiListResponseService.getResponseBody({
        message: 'Users retrieved successfully',
        count,
        pageSize,
        records: users,
      });

      return responseBody;
    } catch (error: any) {
      // TODO: handle errors thrown by search, sort, and filter

      throw new InternalServerErrorException(error);
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const foundUser = await this.usersService.findOne(id);
      if (!foundUser) {
        throw new NotFoundException(`User with id: ${id} does not exist`);
      }

      const responseBody = this.apiResponseService.getResponseBody({
        status: 'success',
        message: 'User retrieved successfully',
        data: foundUser,
      });

      return responseBody;
    } catch (error) {
      if (error?.name === 'NotFoundException') {
        throw new NotFoundException(error?.message);
      }

      throw new InternalServerErrorException(error);
    }
  }

  // TODO: add check to ensure a user cannot update another user's details (admins should be able to delete any account)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(DtoValidationPipe) updateUserDto: UpdateUserDto,
  ) {
    try {
      const foundUser = await this.usersService.findOne(id);

      // update user details
      const detailsToUpdate: DeepPartial<User> = {
        ...foundUser,
        ...updateUserDto,
      };

      const updateResult = await this.usersService.update(detailsToUpdate);

      const responseBody = this.apiResponseService.getResponseBody({
        status: 'success',
        message: 'User updated successfully',
        data: updateResult,
      });

      return responseBody;
    } catch (error) {
      if (error?.name === 'NotFoundException') {
        throw new NotFoundException(error?.message);
      }

      // TODO: delete the saved user image if user details update fails

      // other errors
      throw new InternalServerErrorException(error);
    }
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.usersService.findOne(id);
      await this.usersService.remove(id);

      const responseBody = this.apiResponseService.getResponseBody({
        status: 'success',
        message: 'User deleted successfully',
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

import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiResponseModule } from 'src/core/modules/api-response/api-response.module';
import { SharedModule } from 'src/shared/shared.module';
import { EventCategoryModule } from '../event-category/event-category.module';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    EventCategoryModule,
    EventsModule,
    ApiResponseModule,
    SharedModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [TypeOrmModule, UsersService],
})
export class UsersModule {}

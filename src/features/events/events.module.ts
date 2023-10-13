import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { Event } from './entities/event.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiResponseModule } from 'src/core/modules/api-response/api-response.module';
import { SharedModule } from 'src/shared/shared.module';
import { EventCategoryModule } from '../event-category/event-category.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event]),
    EventCategoryModule,
    ApiResponseModule,
    SharedModule,
  ],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [TypeOrmModule, EventsService],
})
export class EventsModule {}

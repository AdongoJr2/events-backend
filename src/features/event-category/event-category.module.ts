import { Module } from '@nestjs/common';
import { EventCategoryService } from './event-category.service';
import { EventCategoryController } from './event-category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventCategory } from './entities/event-category.entity';
import { ApiResponseModule } from 'src/core/modules/api-response/api-response.module';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EventCategory]),
    ApiResponseModule,
    SharedModule,
  ],
  controllers: [EventCategoryController],
  providers: [EventCategoryService],
  exports: [TypeOrmModule, EventCategoryService],
})
export class EventCategoryModule {}

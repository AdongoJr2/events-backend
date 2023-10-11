import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CommonEntityFields } from '../../../utils/entities/CommonEntityFields';
import { EventCategory } from '../../../features/event-category/entities/event-category.entity';

@Entity()
export class Event extends CommonEntityFields {
  constructor(partial: Partial<Event>) {
    super();
    Object.assign(this, partial);
  }

  @Column({
    nullable: true,
    unique: true,
    length: 256,
  })
  name: string;

  @Column({
    nullable: true,
    unique: true,
    type: 'text',
  })
  description: string;

  @Column({
    length: 256,
  })
  eventVenue: string;

  @Column({
    type: 'timestamptz',
  })
  eventDate: Date;

  @Column({
    type: 'float',
    nullable: true,
  })
  latitude: string;

  @Column({
    type: 'float',
    nullable: true,
  })
  longitude: string;

  @ManyToOne(() => EventCategory, (eventCategory) => eventCategory.events, {
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinColumn()
  eventCategory: EventCategory;
}

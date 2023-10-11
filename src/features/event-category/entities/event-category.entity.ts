import { CommonEntityFields } from '../../../utils/entities/CommonEntityFields';
import { Column, Entity } from 'typeorm';

@Entity()
export class EventCategory extends CommonEntityFields {
  constructor(partial: Partial<EventCategory>) {
    super();
    Object.assign(this, partial);
  }

  @Column({
    nullable: true,
    unique: true,
    length: 256,
  })
  name: string;
}

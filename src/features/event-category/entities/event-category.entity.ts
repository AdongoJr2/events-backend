import { CommonEntityFields } from '../../../utils/entities/CommonEntityFields';
import { Event } from '../../../features/events/entities/event.entity';
import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';
import { User } from '../../../features/users/entities/user.entity';

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

  @OneToMany(() => Event, (event) => event.eventCategory)
  events: Event[];

  @ManyToMany(() => User, (user) => user.interests)
  users: User[];
}

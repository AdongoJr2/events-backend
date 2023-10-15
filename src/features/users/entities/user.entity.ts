import { UserRole } from '../../../utils/enums';
import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { CommonEntityFields } from '../../../utils/entities/CommonEntityFields';
import { Exclude } from 'class-transformer';
import { EventCategory } from '../../../features/event-category/entities/event-category.entity';

@Entity()
export class User extends CommonEntityFields {
  constructor(partial: Partial<User>) {
    super();
    Object.assign(this, partial);
  }

  @Column({
    length: 200,
  })
  firstName: string;

  @Column({
    length: 200,
  })
  lastName: string;

  @Column({
    length: 200,
    nullable: true,
    unique: true,
  })
  username: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column({
    nullable: true,
  })
  phoneNumber: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  role: UserRole;

  @Column()
  @Exclude()
  password: string;

  @Column({
    nullable: true,
  })
  imageURL?: string;

  @Column({
    nullable: true,
  })
  @Exclude()
  passwordResetToken: string;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  @Exclude()
  passwordResetExpires: Date;

  @ManyToMany(() => EventCategory, (eventCategory) => eventCategory.users)
  @JoinTable()
  interests: EventCategory[];
}

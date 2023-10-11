import { UserRole } from '../../../utils/enums';
import { Entity, Column } from 'typeorm';
import { CommonEntityFields } from '../../../utils/entities/CommonEntityFields';
import { Exclude } from 'class-transformer';

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
    unique: true,
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
}

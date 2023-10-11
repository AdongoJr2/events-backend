import { CommonEntityFields } from '../../../utils/entities/CommonEntityFields';
import { Column, Entity } from 'typeorm';

@Entity()
export class RefreshToken extends CommonEntityFields {
  constructor(partial: Partial<RefreshToken>) {
    super();
    Object.assign(this, partial);
  }

  @Column({
    nullable: true,
  })
  token: string;
}

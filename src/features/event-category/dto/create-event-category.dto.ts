import { IsDefined, IsNotEmpty } from 'class-validator';

export class CreateEventCategoryDto {
  @IsDefined({
    message: '$property is required',
  })
  @IsNotEmpty({
    message: '$property cannot be empty',
  })
  name: string;
}

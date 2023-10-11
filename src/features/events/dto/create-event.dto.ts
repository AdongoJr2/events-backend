import {
  IsDateString,
  IsDefined,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsNumberString,
} from 'class-validator';

export class CreateEventDto {
  @IsDefined({
    message: '$property is required',
  })
  @IsNotEmpty({
    message: '$property cannot be empty',
  })
  name: string;

  @IsDefined({
    message: '$property is required',
  })
  @IsNotEmpty({
    message: '$property cannot be empty',
  })
  description: string;

  @IsDefined({
    message: '$property is required',
  })
  @IsNotEmpty({
    message: '$property cannot be empty',
  })
  eventVenue: string;

  @IsDefined({
    message: '$property is required',
  })
  @IsNotEmpty({
    message: '$property cannot be empty',
  })
  @IsDateString()
  eventDate: string;

  @IsDefined({
    message: '$property is required',
  })
  @IsNotEmpty({
    message: '$property cannot be empty',
  })
  @IsLatitude({ message: '$property should be a valid latitude' })
  latitude: string;

  @IsDefined({
    message: '$property is required',
  })
  @IsNotEmpty({
    message: '$property cannot be empty',
  })
  @IsLongitude({ message: '$property should be a valid longitude' })
  longitude: string;

  @IsDefined({
    message: '$property is required',
  })
  @IsNotEmpty({
    message: '$property cannot be empty',
  })
  @IsNumberString(undefined, { message: '$property should be a number' })
  eventCategoryId: string;
}

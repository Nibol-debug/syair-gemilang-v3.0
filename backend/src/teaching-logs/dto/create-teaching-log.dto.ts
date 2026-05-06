import { IsDate, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTeachingLogDto {
  @IsNotEmpty()
  @IsUUID()
  teacher_id: string;

  @IsNotEmpty()
  @IsUUID()
  class_id: string;

  @IsNotEmpty()
  @IsUUID()
  subject_id: string;

  @IsNotEmpty()
  @IsString()
  note: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  date: Date;
}

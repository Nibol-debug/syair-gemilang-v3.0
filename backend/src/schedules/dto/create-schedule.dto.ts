import { IsNotEmpty, IsString, IsUUID, Matches } from 'class-validator';

export class CreateScheduleDto {
  @IsNotEmpty()
  @IsUUID()
  class_id: string;

  @IsNotEmpty()
  @IsUUID()
  subject_id: string;

  @IsNotEmpty()
  @IsUUID()
  teacher_id: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^(Senin|Selasa|Rabu|Kamis|Jumat|Sabtu|Minggu)$/)
  day: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  start_time: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  end_time: string;
}

import { IsNotEmpty, IsOptional, IsUUID, IsDateString, IsDecimal, Min, Max } from 'class-validator';

export class CreateRemedialDto {
  @IsNotEmpty()
  @IsUUID()
  student_id: string;

  @IsNotEmpty()
  @IsUUID()
  subject_id: string;

  @IsOptional()
  @IsUUID()
  exam_id?: string;

  @IsNotEmpty()
  @IsDecimal()
  @Min(0)
  @Max(100)
  score_before: number;

  @IsOptional()
  @IsDateString()
  scheduled_at?: string;

  @IsOptional()
  notes?: string;
}

export class ScheduleRemedialDto {
  @IsNotEmpty()
  @IsUUID()
  exam_id: string;

  @IsNotEmpty()
  @IsDateString()
  scheduled_at: string;
}

export class UpdateRemedialScoreDto {
  @IsNotEmpty()
  @IsDecimal()
  @Min(0)
  @Max(100)
  score_after: number;

  @IsOptional()
  notes?: string;
}

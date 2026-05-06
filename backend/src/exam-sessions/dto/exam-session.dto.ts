import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class StartExamDto {
  @IsNotEmpty()
  @IsString()
  token: string;

  @IsOptional()
  @IsString()
  device_id?: string;
}

export class SubmitAnswerDto {
  @IsNotEmpty()
  @IsUUID()
  question_id: string;

  @IsNotEmpty()
  @IsString()
  answer: string;
}

export class LogViolationDto {
  @IsNotEmpty()
  @IsString()
  type: string; // tab_switch, warning, violation
}

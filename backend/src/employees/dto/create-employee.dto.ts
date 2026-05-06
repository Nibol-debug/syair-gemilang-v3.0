import { IsDate, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEmployeeDto {
  @IsNotEmpty()
  @IsString()
  full_name: string;

  @IsNotEmpty()
  @IsString()
  education: string;

  @IsNotEmpty()
  @IsString()
  position: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  join_date: Date;

  @IsNotEmpty()
  @IsString()
  status: string;

  @IsOptional()
  @IsUUID()
  major_id?: string;
}

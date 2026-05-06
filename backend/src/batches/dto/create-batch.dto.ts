import { IsNotEmpty, IsString, IsInt, IsBoolean, IsOptional } from 'class-validator';

export class CreateBatchDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsInt()
  year_start: number;

  @IsNotEmpty()
  @IsInt()
  year_end: number;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

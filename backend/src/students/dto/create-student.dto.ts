import { IsEmail, IsNotEmpty, IsString, IsDate, IsUUID, IsEnum, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CreateParentDto {
  @IsNotEmpty()
  @IsString()
  father_name: string;

  @IsNotEmpty()
  @IsString()
  mother_name: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  address: string;
}

export class CreateStudentDto {
  @IsNotEmpty()
  @IsString()
  nis: string;

  @IsNotEmpty()
  @IsString()
  nik: string;

  @IsNotEmpty()
  @IsString()
  full_name: string;

  @IsNotEmpty()
  @IsString()
  gender: string;

  @IsNotEmpty()
  @IsString()
  birth_place: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  birth_date: Date;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsUUID()
  class_id: string;

  @IsOptional()
  @IsEnum(['active', 'alumni', 'moved'])
  status?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateParentDto)
  parents?: CreateParentDto;
}
